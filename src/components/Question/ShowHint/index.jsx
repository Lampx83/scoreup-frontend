import Button from "@mui/material/Button";
import {Grow, Icon, Typography, useTheme} from "@mui/material";
import {FaRegLightbulb} from "react-icons/fa";
import Popper from "@mui/material/Popper";
import Box from "@mui/material/Box";
import {IoCloseCircleOutline} from "react-icons/io5";
import Divider from "@mui/material/Divider";
import * as React from "react";
import {useRef} from "react";
import parse from 'html-react-parser';

function ShowHint({
  hint,
  showHint = false
}) {
  const theme = useTheme();
  const popperRef = useRef(null);

  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  };

  const canBeOpen = open && Boolean(anchorEl);
  const idPopper = canBeOpen ? 'transition-popper' : undefined;

  return ( showHint &&
    <Box>
      <Button
        aria-describedby={idPopper}
        onClick={handleClick}
        sx={{
          minWidth: 0,
          backgroundColor: "#FFDC6EFF",
          borderRadius: "50%",
          width: 35,
          height: 35,
          ':hover': {
            backgroundColor: "rgba(255,220,110,0.7)",
            boxShadow: "0 0 10px 0 rgba(255,220,110,0.7)"
          }
        }}
      >
        <Icon as={FaRegLightbulb}/>
      </Button>


      <Popper
        placement="top-end"
        disablePortal={true}
        id={idPopper}
        open={open}
        anchorEl={anchorEl}
        transition={true}
        ref={popperRef}
        modifiers={[
          {
            name: 'flip',
            enabled: true,
            options: {
              altBoundary: true,
              rootBoundary: 'document',
              padding: 8,
            },
          },
          {
            name: 'preventOverflow',
            enabled: true,
            options: {
              altAxis: true,
              altBoundary: true,
              tether: true,
              rootBoundary: 'document',
              padding: 8,
            },
          },
        ]}
        sx={{
          zIndex: 90999
        }}
      >
        {({ TransitionProps }) => (
          <Grow
            {...TransitionProps}
            direction="right"
            timeout={350}
            container={popperRef.current}
          >
            <Box
              sx={{
                padding: "8px 16px",
                backgroundColor: "white",
                backdropFilter: "blur(10px)",
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                minWidth: "400px",
                maxWidth: "400px",
                marginBottom: "8px",
                boxSizing: "border-box",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: "8px",
                }}
              >
                <Typography variant="h6">Giải thích</Typography>
                <Button
                  sx={{
                    minWidth: 0,
                    padding: 0,
                    "&:hover, &:active": {
                      color: theme.palette.text.secondary,
                      backgroundColor: "transparent",
                    },
                  }}
                  onClick={() => setOpen(false)}
                >
                  <IoCloseCircleOutline
                    style={{ width: "24px", height: "24px" }}
                  />
                </Button>
              </Box>
              <Divider />
              <Box
                sx={{
                  padding: "8px 0",
                  color: theme.palette.text.primary,
                  width: "100%",
                }}
              >
                {parse(hint.replaceAll("\\n", "<br />"))}
              </Box>
            </Box>
          </Grow>
        )}
      </Popper>
    </Box>
  )
}

export default ShowHint;