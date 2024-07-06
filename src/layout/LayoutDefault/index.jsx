import Header from "../../components/Header/index.jsx";
import {Outlet} from "react-router-dom";
import {Container} from "@mui/material";

function LayoutDefault() {
  return (
    <Container disableGutters maxWidth={false}>
      <Header/>
      <Outlet/>
    </Container>
  )
}

export default LayoutDefault;