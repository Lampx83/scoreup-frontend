import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl, FormControlLabel, FormGroup, InputLabel, Select,
  TextField,
  Typography
} from "@mui/material";
import Button from "@mui/material/Button";
import * as React from "react";
import {useForm} from "react-hook-form";
import {toast} from "sonner";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import {useEffect, useState} from "react";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ExpandLess from "@mui/icons-material/ExpandLess";
import Collapse from "@mui/material/Collapse";
import ListItem from "@mui/material/ListItem";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {moment} from "~/utils/moment.js";

function NestedListItem({
  setValue = null
}) {
  const [open, setOpen] = useState(false);
  const [checkedObject, setCheckedObject] = useState({
    "so-thuc": false,
    "so-nguyen": false,
    "so-phuc": false
  });

  const handleClick = () => {
    setOpen(!open);
  }

  const handleCheck = (event) => {
    setCheckedObject({
      ...checkedObject,
      [event.target.value]: event.target.checked
    });
  }

  const handleCheckAll = (event) => {
    setCheckedObject({
      "so-thuc": event.target.checked,
      "so-nguyen": event.target.checked,
      "so-phuc": event.target.checked
    });
  }

  useEffect(() => {
    setValue("tags", Object.keys(checkedObject).filter(key => checkedObject[key]));
  }, [checkedObject]);

  return (
    <>
      <ListItem
        disablePadding
        onClick={handleClick}
        secondaryAction={
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center"
            }}
          >
            <Tooltip
              title={"Số lượng câu hỏi"}
              onClick={(e) => e.stopPropagation()}
            >
              <TextField
                sx={{
                  width: 100
                }}
                size={"small"}
                label={"Số lượng"}
                type={"number"}
                variant={"outlined"}
              />
            </Tooltip>
            {open ? <ExpandLess /> : <ExpandMore />}
          </Box>
        }
      >
        <ListItemButton disableGutters>
          <ListItemIcon>
            <Checkbox
              checked={Object.values(checkedObject).every((value) => value)}
              indeterminate={Object.values(checkedObject).some((value) => value) && !Object.values(checkedObject).every((value) => value)}
              onChange={handleCheckAll}
              onClick={(e) => e.stopPropagation()}
            />
          </ListItemIcon>
          <ListItemText primary="Chương 1" />
        </ListItemButton>
      </ListItem>
      <Collapse in={open} timeout="auto">
        <List
          component={FormGroup}
          disablePadding
        >
          <ListItem
            sx={{
              pl: 4,
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)"
              }
            }}
            component={FormControlLabel}
            control={<Checkbox checked={checkedObject["so-thuc"]} onChange={handleCheck}/>}
            label={"Số thực"}
            value={"so-thuc"}
          />
          <ListItem
            sx={{
              pl: 4,
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)"
              }
            }}
            component={FormControlLabel}
            control={<Checkbox checked={checkedObject["so-nguyen"]} onChange={handleCheck}/>}
            label={"Số nguyên"}
            value={"so-nguyen"}
          />
          <ListItem
            sx={{
              pl: 4,
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)"
              }
            }}
            component={FormControlLabel}
            control={<Checkbox checked={checkedObject["so-phuc"]} onChange={handleCheck}/>}
            label={"Số phức"}
            value={"so-phuc"}
          />
        </List>
      </Collapse>
    </>
  )
}

export default function CreateTest({
  open = false,
  handleClose = () => {},
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: undefined,
    criteriaMode: "firstError",
  });

  const [classId, setClassId] = useState("");
  const [startTime, setStartTime] = useState(moment());
  const [endTime, setEndTime] = useState(moment().add(30, "minutes"));

  const handleChangeClass = (event) => {
    setClassId(event.target.value);
  };

  const onSubmit = async (data) => {
    console.log(data)
  };

  const onError = (errors, e) => {
    Object.values(errors).forEach((error) => {
      toast.error(error.message);
    });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit(onSubmit, onError),
        sx: {
          backgroundColor: "#F0F0F0FF",
          minWidth: 500,
          paddingY: 2,
          paddingX: 1
        }
      }}
    >
      <DialogContent
        sx={{
          paddingY: 1
        }}
      >
        <TextField
          autoFocus
          label="Tên bài tập"
          type="text"
          variant={"standard"}
          sx={{
            marginBottom: 4
          }}
          InputProps={{
            style: {
              color: "rgba(0,0,0,0.85)",
              fontWeight: 600,
              padding: 0
            },
          }}
          InputLabelProps={{
            style: {
              color: "rgba(0, 0, 0, 0.54)",
              fontWeight: 600,
            },
          }}
          fullWidth
          {...register("name", {
            required: "Tên bài tập không được để trống",
          })}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <FormControl
          fullWidth
          size={"small"}
          sx={{
            marginBottom: 4
          }}
          error={!!errors.classId}
        >
          <InputLabel
            id="select-class-label"
            sx={{
              color: "rgba(0, 0, 0, 0.54)",
            }}
          >
            Lớp học phần
          </InputLabel>
          <Select
            labelId="select-class-label"
            id="select-class"
            value={classId}
            label="Lớp học phần"
            {...register("classId", {
              required: "Lớp học phần không được để trống",
              value: classId,
              onChange: handleChangeClass
            })}
          >
            <MenuItem value={10}>CNTT64A</MenuItem>
            <MenuItem value={20}>CNTT64B</MenuItem>
            <MenuItem value={30}>CNTT64C</MenuItem>
          </Select>
        </FormControl>
        <Typography
          variant={"body1"}
          fontWeight={700}
        >
          Nội dung bài tập
        </Typography>
        <List
          sx={{ width: '100%' }}
          component="nav"
        >
          <NestedListItem setValue={setValue}/>
        </List>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            variant={"body1"}
            fontWeight={700}
          >
            Thời gian làm bài
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
            }}
          >
            <TextField
              type="number"
              hiddenLabel
              variant={"outlined"}
              size={"small"}
              sx={{
                width: 100
              }}
              InputProps={{
                style: {
                  color: "rgba(0,0,0,0.85)",
                  fontWeight: 600,
                  padding: 0
                },
              }}
              {...register("time", {
                required: "Thời gian làm bài không được để trống",
                pattern: {
                  value: /^[0-9]*$/,
                }
              })}
              error={!!errors.time}
            />
            <Typography
              variant={"body1"}
              fontWeight={700}
            >
              phút
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            marginTop: 2
          }}
        >
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DateTimePicker
              label="Ngày bắt đầu"
              value={startTime}
              onChange={setStartTime}
              sx={{
                marginTop: 2,
                "& .MuiFormLabel-root": {
                  color: "rgba(0, 0, 0, 0.54)",
                  fontWeight: 600
                }
              }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DateTimePicker
              label="Ngày kết thúc"
              value={endTime}
              onChange={setEndTime}
              sx={{
                marginTop: 2,
                "& .MuiFormLabel-root": {
                  color: "rgba(0, 0, 0, 0.54)",
                  fontWeight: 600
                }
              }}
            />
          </LocalizationProvider>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          sx={{
            backgroundColor: '#DEE1E6FF',
            borderRadius: 5,
            color: '#323842FF',
            paddingX: 2,
            ':hover': {
              backgroundColor: 'rgba(26,78,141,0.8)',
              boxShadow: '0 0 10px 0 rgba(26,78,141,0.5)'
            }
          }}
        >
          Huỷ
        </Button>
        <Button
          type="submit"
          sx={{
            backgroundColor: '#1A4E8DFF',
            borderRadius: 5,
            color: 'white',
            paddingX: 2,
            ':hover': {
              backgroundColor: 'rgba(26,78,141,0.8)',
              boxShadow: '0 0 10px 0 rgba(26,78,141,0.5)'
            }
          }}
        >
          Tạo bài tập
        </Button>
      </DialogActions>
    </Dialog>
  );
}