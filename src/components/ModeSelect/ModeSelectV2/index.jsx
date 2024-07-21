import Button from "@mui/material/Button";
import { MdOutlineLightMode, MdOutlineNightlight } from "react-icons/md";
import Tooltip from "@mui/material/Tooltip";
import * as React from "react";
import { useTheme } from "@mui/material";
import { useColorScheme } from "@mui/material/styles";

function ModeSelectV2() {
  const theme = useTheme();
  const { mode, setMode } = useColorScheme();

  const handleModeChange = () => {
    setMode(mode === "light" ? "dark" : "light");
  };

  return (
    <Tooltip
      title="Thay đổi giao diện sáng/tối"
      sx={{ width: "100%", height: "100%" }}
    >
      <Button
        sx={{
          minWidth: 0,
          padding: 0,
          width: "100%",
          height: "100%",
          '& svg': {
            fontSize: 24,
          },
        }}
        onClick={handleModeChange}
      >
        {theme.palette.mode === "light" ? (
          <MdOutlineNightlight />
        ) : (
          <MdOutlineLightMode />
        )}
      </Button>
    </Tooltip>
  );
}

export default ModeSelectV2;
