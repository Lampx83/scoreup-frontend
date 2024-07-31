import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import {Container, Icon, TextField, Typography, useTheme} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { IoSend } from "react-icons/io5";
import Comment from "~/components/Question/Comments/Comment/index.jsx";
import {useForm} from "react-hook-form";
import {toast} from "sonner";
import {getComments, postComment} from "~/services/question.service.js";
import {useEffect, useRef, useState} from "react";
import pushToast from "~/helpers/sonnerToast.js";
import { IoMdRefresh } from "react-icons/io";

const commentFormStyle = (theme) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "1rem auto",
  maxWidth: "100%",
  gap: 1
});

function Comments({
  openComments,
  questionId = "",
  setCountComments = () => {}
}) {
  const theme = useTheme();
  const [comments, setComments] = useState({
    comments: [],
    isMore: false,
    total: 0
  });
  const [limit, setLimit] = useState(5);
  const [offset, setOffset] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: undefined,
    criteriaMode: "firstError",
  });

  // questionId = '5d55a9e2-778b-4b93-bd3e-a9b930604610';

  const onSubmit = async (data) => {
    data.questionId = questionId;
    const res = await postComment({
      content: data.content,
      questionId: questionId
    })
    if (res.statusCode === 200) {
      reset();
      await getCommentsData(limit, offset);
    } else {
      pushToast("Có lỗi xảy ra, vui lòng thử lại sau!", "error");
    }
  }

  const onError = (errors, e) => {
    Object.values(errors).forEach((error) => {
      toast.error(error.message);
    });
  }

  const getCommentsData = async (limit, offset) => {
    const res = await getComments({
      questionId: questionId,
      limit: limit,
      offset: offset
    });

    setComments({
      comments: offset === 0 ? res.metadata.comments : [...comments.comments, ...res.metadata.comments],
      isMore: res.metadata.isMore,
      total: res.metadata.total,
    });

    setCountComments(res.metadata.total);
  }

  let timeout = useRef(null);
  const handleDelayRefresh = () => {
    if (timeout.current) {
      pushToast("Đang tải lại bình luận...", "info");
      return;
    }
    timeout.current = setTimeout(async() => {
      await getCommentsData(limit, offset);
      timeout.current = null;
      pushToast("Đã tải lại bình luận!", "success");
    }, 1000);
  }

  useEffect(() => {
    getCommentsData(limit, offset);
  }, [limit, offset]);

  return (
    <Collapse in={openComments}
      sx={{
        backgroundColor: theme.palette.questionBackground.secondary,
        borderRadius: 2,
        marginY: 2,
      }}
    >
      <Container
        maxWidth={"md"}
        sx={{
          padding: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography variant={"h6"} fontWeight={700}>
            Bình luận
          </Typography>
          <Button
            variant={"text"}
            sx={{
              fontSize: "12px",
              minWidth: 0,
              paddingX: 1,
              paddingY: 0.5
            }}
            onClick={() => handleDelayRefresh()}
          >
            <Icon as={IoMdRefresh}/>
            Làm mới
          </Button>
        </Box>
        <Box sx={{...commentFormStyle(theme)}}>
          <Avatar className="comment-avatar" src={"https://avatar.iran.liara.run/public"}/>
          <Box
            sx={{
              width: "100%",
              display: "flex",
            }}
          >
            <form
              onSubmit={handleSubmit(onSubmit, onError)}
              noValidate={true}
              autoComplete={"off"}
              style={{
                width: "100%",
                display: "flex",
                gap: 1,
              }}
            >
              <TextField
                fullWidth
                size="small"
                variant={"standard"}
                placeholder={"Bình luận gì đó..."}
                {...register("content", {
                  required: "Không thể để trống!",
                })}
                autoComplete={"off"}
              />
              <Button variant="text" type={"submit"} sx={{fontSize: "12px", minWidth: 0}}>
                <Icon as={IoSend}/>
              </Button>
            </form>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0
          }}
        >
          {comments.comments.length ? comments.comments.map((comment, index) => (
            <Comment key={index} comment={comment}/>
          )) : <Typography variant={"body2"} sx={{margin: "auto"}}>Chưa có bình luận nào!</Typography>}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 1
          }}
        >
          {comments.isMore && <Button
            variant={"contained"}
            sx={{
              backgroundColor: "#1A4E8DFF",
              borderRadius: 5,
              color: "white",
              fontSize: "12px",
              transition: "all 0.2s ease-in-out",
              ':hover': {
                backgroundColor: "rgba(26,78,141,0.8)",
                boxShadow: "0 0 10px 0 rgba(26,78,141,0.5)"
              }
            }}
            onClick={() => setOffset(offset + limit)}
          >
            Xem thêm
          </Button>}
          {offset > 0 && <Button
            variant={"contained"}
            sx={{
              backgroundColor: "#1A4E8DFF",
              borderRadius: 5,
              color: "white",
              fontSize: "12px",
              transition: "all 0.2s ease-in-out",
              ':hover': {
                backgroundColor: "rgba(26,78,141,0.8)",
                boxShadow: "0 0 10px 0 rgba(26,78,141,0.5)"
              }
            }}
            onClick={() => setOffset(0)}
          >
            Ẩn bớt
          </Button>}
        </Box>
      </Container>
    </Collapse>
  )
}

export default Comments;