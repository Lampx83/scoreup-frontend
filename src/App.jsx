import "./App.css";
import AllRoutes from "~/components/AllRoutes/index.jsx";
import { Toaster } from "sonner";
import { useTheme } from "@mui/material";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { ExamPaletteProvider } from "~/contexts/ExamPaletteContext";
import HelpGuide from "./components/HelpGuide";
import { matchPath, useLocation } from "react-router-dom";
function App() {
  const theme = useTheme();
  const { pathname } = useLocation();
  const is = (pattern) => !!matchPath({ path: pattern, end: false }, pathname);
  let slug;
  let title;

  if (is("/pre-test/*")) {
    slug = "help_pretest";
    title = "Luyện đề";
  } else if (is("/homepage/*")) {
    slug = "help_homepage";
    title = "Đăng nhập";
  } else if (is("/exam/*")) {
    slug = "help_exam";
    title = "Thi";
  } else if (is("/practice/*")) {
    slug = "help_practice";
    title = "Luyện tập";
  } else if (is("/dashboard/*")) {
    slug = "help-dashboard";
    title = "Dashboard";
  } else if (is("/ranking/*")) {
    slug = "help_ranking";
    title = "Xếp hạng";
  }

  return (
    <ExamPaletteProvider>
      <Toaster
        richColors={true}
        position={"top-right"}
        expand={true}
        closeButton={true}
        // style={{{
        //   top: theme.app.header.height,
        // }}
      />
      <AllRoutes />
      <HelpGuide slug={slug} title={title} />
    </ExamPaletteProvider>
  );
}

export default App;
