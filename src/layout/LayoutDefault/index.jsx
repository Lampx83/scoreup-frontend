import Header from "../../components/Header/index.jsx";
import {Outlet, useLocation} from "react-router-dom";
import {Container} from "@mui/material";
import Footer from "~/components/Footer/index.jsx";
import {toast} from "sonner";
import pushToast from "~/helpers/sonnerToast.js";

function LayoutDefault() {
  const { state } = useLocation();

  if (state?.messageToast) {
    pushToast(state.messageToast.message, state.messageToast.type);
    state.messageToast = null;
  }

  return (
    <Container disableGutters maxWidth={false}>
      <Header/>
      <Outlet/>
      <Footer/>
    </Container>
  )
}

export default LayoutDefault;