import * as React from "react";
import Box from "@mui/material/Box";
import headerImg from "~/assets/images/header_userhomepage.png";
import {Container, Typography, useTheme} from "@mui/material";
import useSideBar from "~/hooks/useSideBar.jsx";

export default function UserHomePage() {
  const theme = useTheme();
  const {open: openSideBar} = useSideBar();

  return (
    <Container maxWidth={false}
      sx={{
        margin: "auto",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "238px",
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            marginLeft: 10,
            maxWidth: "50%",
            whiteSpace: "wrap",
            color: "white"
          }}
        >
          <Typography variant="h4" fontWeight={700} sx={{}}>
            Xin chào, Duy Việt!
          </Typography>
          <Typography variant="p" fontWeight={500} sx={{}}>
            Lướt xuống để xem các bài tập được gợi ý riêng cho bạn.
          </Typography>
        </Box>
        <img src={headerImg} alt="header" style={{
          width: "100%",
          height: "238px",
          borderRadius: 15,
          objectFit: "cover",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: -1
        }}/>
      </Box>
    </Container>
  );
}
