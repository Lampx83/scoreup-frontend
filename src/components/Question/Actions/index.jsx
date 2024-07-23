import Box from "@mui/material/Box";
import {Icon, Typography, useTheme} from "@mui/material";
import Button from "@mui/material/Button";
import {FaCheck, FaRegComment, FaRegLightbulb} from "react-icons/fa";
import {FaRegFaceSadTear} from "react-icons/fa6";
import * as React from "react";

function Actions() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        justifyContent: "space-between",
      }}
    >
      <Button
        variant={"contained"}
        sx={{
          backgroundColor: "#1A4E8DFF",
          borderRadius: 5,
          color: "white",
          fontSize: "12px",
          ':hover': {
            backgroundColor: "rgba(26,78,141,0.8)",
            boxShadow: "0 0 10px 0 rgba(26,78,141,0.5)"
          }
        }}
      >
        <Icon as={FaRegComment} sx={{marginRight: 1, fontSize: '16px'}}/>
        Bình luận (12)
      </Button>
      <Box sx={{display: "flex", gap: 1}}>
        <Button
          variant={"contained"}
          sx={{
            backgroundColor: "#03DAC6FF",
            borderRadius: 5,
            color: "white",
            fontSize: "12px",
            ':hover': {
              backgroundColor: "rgba(3,218,198,0.7)",
              boxShadow: "0 0 10px 0 rgba(3,218,198,0.5)"
            }
          }}
        >
          <Icon as={FaCheck} sx={{marginRight: 1, fontSize: '16px'}}/>
          Đã thành thạo
        </Button>
        <Button
          variant={"contained"}
          sx={{
            backgroundColor: "#FF8D6BFF",
            borderRadius: 5,
            color: "white",
            fontSize: "12px",
            ':hover': {
              backgroundColor: "rgba(255,141,107,0.8)",
              boxShadow: "0 0 10px 0 rgba(255,141,107,0.5)"
            }
          }}
        >
          <Icon as={FaRegFaceSadTear} sx={{marginRight: 1, fontSize: '16px'}}/>
          Chưa chắc chắn
        </Button>
      </Box>
    </Box>
  )
}

export default Actions;