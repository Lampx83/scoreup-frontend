import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import {Icon, TextField, Typography, useTheme} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { IoSend } from "react-icons/io5";
import Comment from "~/components/Question/Comments/Comment/index.jsx";

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
}) {
  const theme = useTheme();
  const comments = [
    {
      user: {
        fullName: "Nguyễn Văn A"
      },
      content: "Câu trả lời sai rồi bạn ơi"
    },
    {
      user: {
        fullName: "Trần Văn B"
      },
      content: "Câu trả lời đúng rồi bạn ơi"
    }
  ];

  return (
    <Collapse in={openComments}>
      <Box
        sx={{
          padding: 3,
          backgroundColor: theme.palette.questionBackground.secondary,
          borderRadius: 2,
          marginY: 2,
        }}
      >
        <Typography variant={"h6"} fontWeight={700}>
          Bình luận
        </Typography>
        <Box sx={{...commentFormStyle(theme)}}>
          <Avatar className="comment-avatar" src={"https://avatar.iran.liara.run/public"}/>
          <Box
            sx={{
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
            />
            <Button variant="text" sx={{fontSize: "12px", minWidth: 0}}>
              <Icon as={IoSend}/>
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0
          }}
        >
          {comments.map((comment, index) => (
            <Comment key={index} comment={comment}/>
          ))}
        </Box>
      </Box>
    </Collapse>
  )
}

export default Comments;