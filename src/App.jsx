import "./App.css";
import AllRoutes from "~/components/AllRoutes/index.jsx";
import { Toaster } from "sonner";
import { useTheme } from "@mui/material";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { ExamPaletteProvider } from "~/contexts/ExamPaletteContext";
import HelpGuide from "./components/HelpGuide";
import { useLocation } from "react-router-dom";
function App() {
  const theme = useTheme();
  const { pathname } = useLocation();

  let slug;
  let title;

  if (pathname.startsWith("/pre-test")) {
    slug = "help_pretest";
    title = "Luyện đề";
  } else if (pathname.startsWith("/homepage")) {
    slug = "help_homepage";
    title = "Đăng nhập";
  } else if (pathname.startsWith("/exam")) {
    slug = "help_exam";
    title = "Thi";
  } else if (pathname.startsWith("/practice")) {
    slug = "help_practice";
    title = "Luyện tập";
  } else if (pathname.startsWith("/dashboard")) {
    slug = "help-dashboard";
    title = "Dashboard";
  } else if (pathname.startsWith("/ranking")) {
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
