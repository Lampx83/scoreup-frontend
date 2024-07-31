import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { Icon, TextField, Typography, useTheme } from "@mui/material";
import Button from "@mui/material/Button";
import { BsReply } from "react-icons/bs";
import {memo, useEffect, useRef, useState} from "react";
import { getDiffTime } from "~/utils/moment.js";
import Collapse from "@mui/material/Collapse";
import { IoSend } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { getComments, postComment } from "~/services/question.service.js";
import pushToast from "~/helpers/sonnerToast.js";
import { toast } from "sonner";
import cookies from "~/utils/cookies.js";
import unionArrays from "~/helpers/unionArrays.js";
import {IoMdRefresh} from "react-icons/io";

const commentStyle = (theme) => ({
  display: "flex",
  gap: 1,
  backgroundColor: theme.palette.questionBackground.secondary,
  borderRadius: 2,
  color: theme.palette.text.secondary,
  marginY: 1,
});

const commentFormStyle = (theme) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "1rem auto",
  width: "100%",
  gap: 1,
});

function Comment({ comment }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState({
    comments: [],
    isMore: false,
    total: 0,
  });
  const [limit, setLimit] = useState(5);
  const [offset, setOffset] = useState(0);
  const [countComments, setCountComments] = useState(0);
  const user = cookies.get("user", { path: "/" });

  let diff = getDiffTime(comment.createdAt);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: undefined,
    criteriaMode: "firstError",
  });

  // questionId = '5d55a9e2-778b-4b93-bd3e-a9b930604610';

  const onSubmit = async (data) => {
    const res = await postComment({
      content: data.content,
      questionId: comment.itemId,
      parentId: comment._id,
    });
    if (res.statusCode === 200) {
      reset();
      await getCommentsData(limit, offset);
    } else {
      pushToast("Có lỗi xảy ra, vui lòng thử lại sau!", "error");
    }
  };

  const onError = (errors, e) => {
    Object.values(errors).forEach((error) => {
      toast.error(error.message);
    });
  };

  const getCommentsData = async (limit, offset) => {

    const res = await getComments({
      questionId: comment.itemId,
      parentId: comment._id,
      limit,
      offset,
      sort: "asc",
    });

    setComments({
      comments: unionArrays(comments.comments, res.metadata.comments),
      isMore: res.metadata.isMore,
      total: res.metadata.total,
    });

    setCountComments(res.metadata.total);
  };

  useEffect(() => {
    if (!comment.parentId)
      getCommentsData(limit, offset);
  }, [limit, offset]);

  const handleOpenChildren = async (parentId) => {
    setOpen(!open);
    if (!open) {
      await getCommentsData(limit, offset);
    }
  };

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

  return (
    <Box sx={{ ...commentStyle(theme) }}>
      {comment?.user?.avatar ? (
        <Avatar src={comment?.user?.avatar} className={"comment-avatar"} />
      ) : (
        <Avatar className={"comment-avatar"} />
      )}
      <Box
        sx={{
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            backgroundColor: theme.palette.questionBackground.primary,
            padding: 1,
            borderRadius: 2,
            width: "fit-content",
          }}
        >
          <Typography variant="body1" fontWeight={700}>
            {comment?.user?.fullName}
          </Typography>
          <Typography variant="body2" color={"text.primary"}>
            {comment?.content}
          </Typography>
        </Box>

        <Box
          sx={{
            marginY: 0.5,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <Typography variant="caption" color={"text.secondary"}>
            {diff}
          </Typography>
          {/*<Button variant="text" sx={{fontSize: "12px", minWidth: 0, paddingX: 1, paddingY: 0.5}}>*/}
          {/*  <Icon as={BiLike}/>*/}
          {/*  Thích*/}
          {/*</Button>*/}
          {!comment.parentId && (
            <Button
              variant="text"
              sx={{
                fontSize: "12px",
                minWidth: 0,
                paddingX: 1,
                paddingY: 0.5,
              }}
              onClick={() => handleOpenChildren(comment._id)}
            >
              <Icon as={BsReply} />
              Trả lời ({countComments})
            </Button>
          )}
        </Box>
        {!comment.parentId && (
          <Collapse in={open}>
            <Box>
              {comments.comments.map((comment) => (
                <Comment key={comment._id} comment={comment} />
              ))}
            </Box>
            <Box>
              {comments.isMore && (
                <Button
                  variant="text"
                  sx={{
                    fontSize: "12px",
                    minWidth: 0,
                    paddingX: 1,
                    paddingY: 0.5,
                    marginLeft: "auto",
                  }}
                  onClick={() => setOffset(offset + limit)}
                >
                  Xem thêm
                </Button>
              )}
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
            <Box sx={{ ...commentFormStyle(theme) }}>
              <Avatar className="comment-avatar" src={user?.avatar} />
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
                    placeholder={"Trả lời..."}
                    {...register("content", {
                      required: "Không thể để trống!",
                    })}
                    autoComplete={"off"}
                  />
                  <Button
                    variant="text"
                    type={"submit"}
                    sx={{ fontSize: "12px", minWidth: 0 }}
                  >
                    <Icon as={IoSend} />
                  </Button>
                </form>
              </Box>
            </Box>
          </Collapse>
        )}
      </Box>
    </Box>
  );
}

export default memo(Comment);
