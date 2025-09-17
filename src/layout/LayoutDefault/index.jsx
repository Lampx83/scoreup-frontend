import { Outlet, useLocation } from "react-router-dom";
import pushToast from "~/helpers/sonnerToast.js";
import Box from "@mui/material/Box";
import SideBarUser from "~/components/SideBarUser/index.jsx";
import * as React from "react";
import Histats from "~/components/Histats";

function LayoutDefault() {
  const { state } = useLocation();

  if (state?.messageToast) {
    pushToast(state.messageToast.message, state.messageToast.type);
    state.messageToast = null;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Histats />
      <SideBarUser />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: state?.noPadding ? 0 : 3, position: "relative" }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default LayoutDefault;
