import Header from "../../components/Header/index.jsx";
import {Outlet} from "react-router-dom";
import {Container} from "@mui/material";
import Footer from "~/components/Footer/index.jsx";

function LayoutDefault() {
  return (
    <Container disableGutters maxWidth={false}>
      <Header/>
      <Outlet/>
      <Footer/>
    </Container>
  )
}

export default LayoutDefault;