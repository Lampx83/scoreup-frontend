import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import {Icon, Typography, useTheme} from "@mui/material";
import Button from "@mui/material/Button";
import {BiLike} from "react-icons/bi";
import {BsReply} from "react-icons/bs";

const commentStyle = (theme) => ({
  display: "flex",
  gap: 1,
  backgroundColor: theme.palette.questionBackground.secondary,
  borderRadius: 2,
  color: theme.palette.text.secondary,
  paddingY: 1,
  marginY: 1
});

function Comment({ comment }) {
  const theme = useTheme();

  return (
    <Box
      sx={{...commentStyle(theme)}}
    >
      <Avatar className="comment-avatar" src={"https://avatar.iran.liara.run/public"}/>
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
          <Typography variant="caption" color={"text.secondary"}>1 giờ trước</Typography>
          <Button variant="text" sx={{fontSize: "12px", minWidth: 0}}>
            <Icon as={BiLike}/>
            Thích
          </Button>
          <Button variant="text" sx={{fontSize: "12px", minWidth: 0}}>
            <Icon as={BsReply}/>
            Trả lời
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default Comment;