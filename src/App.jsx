import './App.css'
import AllRoutes from "~/components/AllRoutes/index.jsx";
import {Toaster} from "sonner";
import {useTheme} from "@mui/material";

function App() {
  const theme = useTheme();

  return (
    <>
      <Toaster
        richColors={true}
        position={"top-right"}
        expand={true}
        closeButton={true}
        // style={{
        //   top: theme.app.header.height,
        // }}
      />
      <AllRoutes/>
    </>
  )
}

export default App
