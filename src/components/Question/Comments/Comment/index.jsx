import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import {Icon, Typography, useTheme} from "@mui/material";
import Button from "@mui/material/Button";
import {BiLike} from "react-icons/bi";
import {BsReply} from "react-icons/bs";
import {memo} from "react";
import {getDiffTime} from "~/utils/moment.js";

const commentStyle = (theme) => ({
  display: "flex",
  gap: 1,
  backgroundColor: theme.palette.questionBackground.secondary,
  borderRadius: 2,
  color: theme.palette.text.secondary,
  marginY: 1
});

function Comment({ comment }) {
  const theme = useTheme();

  let diff = getDiffTime(comment.createdAt);

  return (
    <Box
      sx={{...commentStyle(theme)}}
    >
      {comment?.user?.avatar ? <Avatar src={comment?.user?.avatar} className={"comment-avatar"}/> : <Avatar className={"comment-avatar"}/>}
      <Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            backgroundColor: theme.palette.questionBackground.primary,
            padding: 1,
            borderRadius: 2,
          }}
        >
          <Typography variant="body1" fontWeight={700}>{comment?.user?.fullName}</Typography>
          <Typography variant="body2" color={"text.primary"}>{comment?.content}</Typography>
        </Box>
        <Box
          sx={{
            marginY: 0.5,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <Typography variant="caption" color={"text.secondary"}>{diff}</Typography>
          <Button variant="text" sx={{fontSize: "12px", minWidth: 0, paddingX: 1, paddingY: 0.5}}>
            <Icon as={BiLike}/>
            Thích
          </Button>
          <Button variant="text" sx={{fontSize: "12px", minWidth: 0, paddingX: 1, paddingY: 0.5}}>
            <Icon as={BsReply}/>
            Trả lời
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default memo(Comment);