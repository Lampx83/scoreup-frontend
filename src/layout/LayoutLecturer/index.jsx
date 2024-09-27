import {Outlet, useLocation} from "react-router-dom";
import pushToast from "~/helpers/sonnerToast.js";
import Box from "@mui/material/Box";
import * as React from "react";
import LecturerHeader from "~/components/LecturerComponents/Header/index.jsx";
import {Container} from "@mui/material";
import Footer from "~/components/Footer/index.jsx";

function LayoutLecturer() {
  const { state } = useLocation();

  if (state?.messageToast) {
    pushToast(state.messageToast.message, state.messageToast.type);
    state.messageToast = null;
  }

  return (
    <Box>
      <LecturerHeader/>
      <Container
        maxWidth={'lg'}
        sx={{
          paddingTop: theme => (`calc(30px + ${theme.app.header.height})`),
        }}
      >
        <Outlet/>
      </Container>
      <Footer/>
    </Box>
  )
}

export default LayoutLecturer;