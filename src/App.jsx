import "./App.css";
import AllRoutes from "~/components/AllRoutes/index.jsx";
import { Toaster } from "sonner";
import { useTheme } from "@mui/material";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { ExamPaletteProvider } from "~/contexts/ExamPaletteContext";

function App() {
  const theme = useTheme();

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
    </ExamPaletteProvider>
  );
}

export default App;
