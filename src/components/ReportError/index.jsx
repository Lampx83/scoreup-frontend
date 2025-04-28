import Button from "@mui/material/Button";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grow,
  Icon, TextField,
  Typography,
  useTheme
} from "@mui/material";
import Box from "@mui/material/Box";
import * as React from "react";
import {useState} from "react";
import {TbMessageReport} from "react-icons/tb";
import Tooltip from "@mui/material/Tooltip";
import {useForm} from "react-hook-form";
import pushToast from "~/helpers/sonnerToast.js";
import axios from "~/config/axios.js";
import {post} from "~/utils/request.js";
import IconButton from "@mui/material/IconButton";

function ReportError({
  question = null,
  context = null
}) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: undefined,
    criteriaMode: "firstError",
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async (data) => {
    let questionMarkdown = "";
    if (question) {
      questionMarkdown = `Báo lỗi câu hỏi: ${question?.question}\n`;
      questionMarkdown += question.options.map((option, index) => (
        `${option?.option}. ${option?.text}`
      )).join("\n");
    }

    try {
      const res = await post("/app/error", {
        message: `
          ${questionMarkdown ? questionMarkdown + "\n\n" : ""}
          ${data.description}  
        `,
        code: question?.code || null
      })
      pushToast("Báo lỗi thành công! Chúng tôi sẽ kiểm tra sớm nhất có thể!", "success");
      handleClose();
    } catch (error) {
      pushToast("Có lỗi xảy ra, vui lòng thử lại sau", "error");
    }
  };

  const onError = (errors, e) => {
    Object.values(errors).forEach((error) => {
      pushToast(error.message, "error");
    });
  }

  return (
    <>
      <Tooltip title={"Báo lỗi"}>
        <IconButton
          onClick={handleClickOpen}
          sx={{
            minWidth: 0,
            backgroundColor: "#FFDC6EFF",
            borderRadius: "50%",
            ':hover': {
              backgroundColor: "rgba(255,220,110,0.7)",
              boxShadow: "0 0 10px 0 rgba(255,220,110,0.7)"
            }
          }}
        >
          <Icon as={TbMessageReport}/>
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 2,
            padding: 1,
            boxShadow: "none",
            minWidth: 1000
          },
          component: "form",
          onSubmit: handleSubmit(onSubmit, onError),
          id: "report-error-form"
        }}
      >
        <DialogTitle id="alert-dialog-title">
          {`Báo lỗi`}
        </DialogTitle>
        <DialogContent>
          {!!context ? context : question ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                marginBottom: 2,
                border: "1px solid #0000001A",
                padding: 2,
                borderRadius: 2
              }}
            >
              <Typography
                variant={"body1"}
              >
                {`Câu hỏi: ${question?.question}`}
              </Typography>
              {question.options.map((option, index) => (
                <Typography
                  key={index}
                  variant={"body1"}
                >
                  {`${option?.option}. ${option?.text}`}
                </Typography>
              ))}
            </Box>
          ) : null}
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Mô tả lỗi"
            type="text"
            fullWidth
            {...register("description", {
              required: "Mô tả lỗi không được để trống"
            })}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Huỷ</Button>
          <Button
            type="submit"
            form="report-error-form"
            autoFocus
            sx={{
              backgroundColor: "#FFDC6EFF",
              ':hover': {
                backgroundColor: "rgba(255,220,110,0.7)",
                boxShadow: "0 0 10px 0 rgba(255,220,110,0.7)"
              }
            }}
          >
            Gửi
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ReportError;