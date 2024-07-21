import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import {TbFilter} from "react-icons/tb";
import ListItemText from "@mui/material/ListItemText";
import Popper from "@mui/material/Popper";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup, FormLabel,
  Grow,
  List,
  Radio, RadioGroup,
  Slide,
  Typography,
  useTheme
} from "@mui/material";
import Box from "@mui/material/Box";
import {ClickAwayListener} from "@mui/base/ClickAwayListener";
import * as React from "react";
import {memo, useRef} from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import NestedList from "~/components/NestedList/index.jsx";

function Filter({
  active = {},
  open = false,
}) {
  const theme = useTheme();
  const [openFilter, setOpenFilter] = React.useState(false);
  const [anchorElFilter, setAnchorElFilter] = React.useState(null);
  const handleClickFilterButton = (event) => {
    setAnchorElFilter(event.currentTarget);
    setOpenFilter((previousOpen) => !previousOpen);
  };
  const canBeOpenFilter = openFilter && Boolean(anchorElFilter);
  const idFilter = canBeOpenFilter ? "transition-popper" : undefined;
  const popperFilterRef = useRef(null);

  return (
    <ClickAwayListener onClickAway={() => setOpenFilter(false)}>
      <ListItem disablePadding style={{ display: "block" }}>
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: open ? "initial" : "center",
            px: 2.5,
            ...(openFilter && active),
          }}
          aria-describedby={idFilter}
          onClick={handleClickFilterButton}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : "auto",
              justifyContent: "center",
            }}
          >
            <TbFilter style={{ width: "24px", height: "24px" }} />
          </ListItemIcon>
          <ListItemText
            primary={"Bộ lọc"}
            sx={{ opacity: open ? 1 : 0 }}
          />
        </ListItemButton>

        <Popper
          id={idFilter}
          open={openFilter}
          anchorEl={anchorElFilter}
          transition
          placement="right"
          disablePortal={true}
          ref={popperFilterRef}
          modifiers={[
            {
              name: "flip",
              enabled: true,
              options: {
                altBoundary: true,
                rootBoundary: "document",
                padding: 8,
              },
            },
            {
              name: "preventOverflow",
              enabled: true,
              options: {
                altAxis: false,
                altBoundary: true,
                tether: true,
                rootBoundary: "document",
                padding: 8,
              },
            },
          ]}
        >
          {({ TransitionProps }) => (
            <Grow
              {...TransitionProps}
              direction="right"
              timeout={350}
              container={popperFilterRef.current}
            >
              <Box
                sx={{
                  padding: '8px 16px',
                  backgroundColor: theme.palette.headerBackground,
                  backdropFilter: "blur(10px)",
                  boxShadow: theme.palette.boxShadow,
                  borderRadius: 2,
                  minWidth: "400px",
                  marginLeft: 1,
                  boxSizing: "border-box",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingBottom: '8px'
                  }}
                >
                  <Typography variant="h6">Bộ lọc</Typography>
                  <Button
                    sx={{
                      minWidth: 0,
                      padding: 0,
                      '&:hover, &:active': {
                        color: theme.palette.text.secondary,
                        backgroundColor: 'transparent'
                      },
                    }}
                    onClick={() => setOpenFilter(false)}
                  >
                    <IoCloseCircleOutline style={{width: '24px', height: '24px'}} />
                  </Button>
                </Box>
                <Divider/>
                <List>
                  <ListItem disablePadding sx={{ display: "block" }}>
                    <NestedList
                      title={"Môn học"}
                      level={0}
                      initState={true}
                      sx = {{
                        minHeight: 48,
                        px: 0,
                        overflowX: 'hidden',
                        display: 'flex',
                        justifyContent: 'flex-start',
                      }}
                    >
                      <ListItem component={'div'} disablePadding={true}>
                        <FormControl>
                          <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            sx={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              flexDirection: 'row',
                              gap: 1
                            }}
                          >
                            <FormControlLabel sx={{flexBasis: '50%', width: '100%', marginRight: 0}} value={"nhap-mon-cntt"} control={<Radio />} label="Nhập môn CNTT" />
                            <FormControlLabel sx={{flexBasis: '50%', width: '100%', marginRight: 0}} value={"toeic"} control={<Radio />} label="Toeic" />
                            <FormControlLabel sx={{flexBasis: '50%', width: '100%', marginRight: 0}} value={"sat"} control={<Radio />} label="SAT" />
                            <FormControlLabel sx={{flexBasis: '50%', width: '100%', marginRight: 0}} value={"gre"} control={<Radio />} label="GRE" />
                          </RadioGroup>
                        </FormControl>
                      </ListItem>
                    </NestedList>
                  </ListItem>
                  <ListItem disablePadding sx={{ display: "block" }}>
                    <NestedList
                      title={"Nội dung học"}
                      level={0}
                      initState={true}
                      sx = {{
                        minHeight: 48,
                        px: 0,
                        overflowX: 'hidden',
                        display: 'flex',
                        justifyContent: 'flex-start',
                      }}
                    >
                      <ListItem component={'div'} disablePadding={true}>
                        <FormGroup
                          sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            flexDirection: 'row',
                            gap: 1
                          }}
                        >
                          <FormControlLabel sx={{flexBasis: '50%', width: '100%', marginRight: 0}} control={<Checkbox />} label="Chương 1" />
                          <FormControlLabel sx={{flexBasis: '50%', width: '100%', marginRight: 0}} control={<Checkbox />} label="Chương 2" />
                          <FormControlLabel sx={{flexBasis: '50%', width: '100%', marginRight: 0}} control={<Checkbox />} label="Chương 3" />
                          <FormControlLabel sx={{flexBasis: '50%', width: '100%', marginRight: 0}} control={<Checkbox />} label="Chương 4" />
                        </FormGroup>
                      </ListItem>
                    </NestedList>
                  </ListItem>
                  <Divider sx={{marginBottom: 2}}/>
                  <ListItem disablePadding sx={{ display: "block" }}>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 3,
                        justifyContent: 'center'
                      }}
                    >
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => setOpenFilter(false)}
                        sx={{
                          borderRadius: 6,
                          // backgroundColor: theme.palette.text.primary,
                        }}
                      >Hủy</Button>
                      <Button
                        variant="contained"
                        fullWidth
                        sx={{
                          borderRadius: 6,
                          backgroundColor: theme.palette.text.secondary,
                          ':hover' : {
                            backgroundColor: theme.palette.text.secondary
                          }
                        }}
                      >Áp dụng</Button>
                    </Box>
                  </ListItem>
                </List>
              </Box>
            </Grow>
          )}
        </Popper>
      </ListItem>
    </ClickAwayListener>
  );
}

export default Filter;