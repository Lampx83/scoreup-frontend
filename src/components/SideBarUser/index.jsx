import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Logo from "~/assets/images/full_body_logo.png";
import { Link, Link as LinkRouter } from "react-router-dom";
import LinkMui from "@mui/material/Link";
import {FaHammer, FaHome} from "react-icons/fa";
import { RiDashboard3Line } from "react-icons/ri";
import Filter from "~/components/SideBarUser/Filter/index.jsx";
import {Grid, Typography} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import {MdLogout, MdRecommend} from "react-icons/md";
import Button from "@mui/material/Button";
import useAuth from "~/hooks/useAuth.jsx";
import Tooltip from "@mui/material/Tooltip";
import Badge from '@mui/material/Badge';
import Stack from '@mui/material/Stack';
import ModeSelectV2 from "~/components/ModeSelect/ModeSelectV2/index.jsx";
import useSideBar from "~/hooks/useSideBar.jsx";
import cookies from "~/utils/cookies.js";
import useActiveTab from "~/hooks/useActiveTab.jsx";
import { FaBookOpen } from "react-icons/fa";
import {FcStatistics} from "react-icons/fc";
import {IoIosStats} from "react-icons/io";
import ReportError from "~/components/ReportError/index.jsx";
import useRecommendModal from "~/hooks/useModalRecommend.jsx";
import {useEffect} from "react";
import {getUser} from "~/services/user.service.js";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const activeListItem = (theme) => ({
  backgroundColor: theme.palette.action.selected,
  borderLeft: `4px solid #1A4E8DFF`,
  "&:hover, &:focus": {
    backgroundColor: theme.palette.action.selected,
  },
  "& .MuiListItemIcon-root": {
    color: theme.palette.mode === "light" ? "#1A4E8DFF" : "",
  },
  "& .MuiListItemText-primary": {
    color: theme.palette.mode === "light" ? "#1A4E8DFF" : "",
    fontWeight: theme.typography.fontWeightBold,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  // backgroundColor: theme.palette.mode === 'dark' ? 'black' : 'white',
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

export default function SideBarUser() {
  const theme = useTheme();
  const auth = useAuth();
  const {activeTab, updateActiveTab} = useActiveTab();
  const {open, handleDrawerOpen, handleDrawerClose} = useSideBar();
  const {handleOpen: handleOpenRecommend} = useRecommendModal();
  const [user, setUser] = React.useState({});

  const handleFixError = () => {
    localStorage.clear();
    window.location.reload();
  }

  useEffect(() => {
    getUser().then(res => {
      setUser(res);
    });
  }, []);

  return (
    <>
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          "& .MuiPaper-root": {
            overflow: "visible",
            justifyContent: 'space-between',
          },
        }}
      >
        <Box>
          <DrawerHeader>
            <LinkMui
              sx={{
                display: open ? "flex" : "none",
                alignItems: "center",
                backgroundColor: "transparent",
              }}
              component={LinkRouter}
            >
              <img
                src={Logo}
                alt="logo"
                style={{ height: "40px", paddingLeft: "10px" }}
              />
            </LinkMui>

            <IconButton
              onClick={open ? handleDrawerClose : handleDrawerOpen}
              sx={{
                marginLeft: open ? "auto" : 0,
              }}
            >
              {open ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
          </DrawerHeader>
          <List>
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  ...((activeTab === 'dashboard') && activeListItem(theme)),
                }}
                component={Link}
                to="/dashboard"
                onClick={() => updateActiveTab('dashboard')}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <RiDashboard3Line style={{ width: "24px", height: "24px" }} />
                </ListItemIcon>
                <ListItemText
                  primary={"Dashboard"}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  ...((activeTab === 'practice') && activeListItem(theme)),
                }}
                component={Link}
                to="/practice"
                onClick={() => updateActiveTab('practice')}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <FaBookOpen style={{ width: "24px", height: "24px" }} />
                </ListItemIcon>
                <ListItemText
                  primary={"Luyện tập"}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
            {/*<ListItem disablePadding sx={{ display: "block" }}>
              <NestedList
                title="Đã lưu"
                Icon={FiBookmark}
                drawerOpen={open}
                handleDrawerOpen={handleDrawerOpen}
                active={activeListItem(theme)}
              >
                <NestedList
                  title={"Nhập môn công nghệ thông tin"}
                  level={2}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      // px: 2.5,
                    }}
                    component={Link}
                    to="/"
                  >
                    <ListItemText
                      primary={"Chương 1"}
                      sx={{
                        opacity: open ? 1 : 0,
                        whiteSpace: "wrap",
                        textWrap: "wrap",
                      }}
                    />
                  </ListItemButton>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      // px: 2.5,
                    }}
                    component={Link}
                    to="/"
                  >
                    <ListItemText
                      primary={"Chương 2"}
                      sx={{
                        opacity: open ? 1 : 0,
                        whiteSpace: "wrap",
                        textWrap: "wrap",
                      }}
                    />
                  </ListItemButton>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      // px: 2.5,
                    }}
                    component={Link}
                    to="/"
                  >
                    <ListItemText
                      primary={"Chương 3"}
                      sx={{
                        opacity: open ? 1 : 0,
                        whiteSpace: "wrap",
                        textWrap: "wrap",
                      }}
                    />
                  </ListItemButton>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      // px: 2.5,
                    }}
                    component={Link}
                    to="/"
                  >
                    <ListItemText
                      primary={"Chương 4"}
                      sx={{
                        opacity: open ? 1 : 0,
                        whiteSpace: "wrap",
                        textWrap: "wrap",
                      }}
                    />
                  </ListItemButton>
                </NestedList>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                  component={Link}
                  to="/"
                >
                  <ListItemText
                    primary={"Xem thêm..."}
                    sx={{
                      opacity: open ? 1 : 0,
                      whiteSpace: "wrap",
                      textWrap: "wrap",
                    }}
                  />
                </ListItemButton>
              </NestedList>
            </ListItem>*/}
          </List>
          <Divider />
          <List>
            {activeTab === 'practice' && <Filter active={activeListItem(theme)} open={open}/>}
            {(activeTab === 'dashboard' && user?.recommend) && <ListItem disablePadding sx={{display: "block"}}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
                onClick={handleOpenRecommend}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <MdRecommend style={{width: "24px", height: "24px"}}/>
                </ListItemIcon>
                <ListItemText
                  primary={"Gợi ý"}
                  sx={{opacity: open ? 1 : 0}}
                />
              </ListItemButton>
            </ListItem>}
          </List>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: 'wrap',
            padding: 1
          }}
        >
          <Tooltip
            title="Sửa lỗi"
            sx={{ width: "100%", height: "100%" }}
          >
            <Button
              sx={{
                minWidth: 0,
                padding: 1,
                '& svg': {
                  fontSize: 24,
                },
                marginBottom: 1
              }}
              onClick={handleFixError}
            >
              <FaHammer/>
            </Button>
          </Tooltip>
          <Tooltip
            title="Thống kê"
            sx={{ width: "100%", height: "100%" }}
          >
            <Button
              sx={{
                minWidth: 0,
                padding: 1,
                '& svg': {
                  fontSize: 24,
                },
                marginBottom: 1
              }}
              component={Link}
              to="/lecturer/statistic"
            >
              <IoIosStats/>
            </Button>
          </Tooltip>
          <ReportError/>
          {!open && <Box
            sx={{
              height: "48px",
              width: "48px",
              marginBottom: '10px'
            }}
          >
            <ModeSelectV2/>
          </Box>}
          <Grid container>
            <Grid
              item
              xs={open ? 9 : 12}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Stack direction="row" spacing={2} onClick={handleDrawerOpen} sx={{cursor: "pointer"}}>
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                >
                  {user?.avatar ? <Avatar src={user?.avatar}/> : <Avatar/>}
                </StyledBadge>
              </Stack>
              <Tooltip
                title={user?.fullName || user?.email || "User"}
                sx={{ width: "100%", height: "100%" }}
              >
                <Typography
                  variant="body1"
                  fontWeight={700}
                  sx={{
                    marginLeft: 1,
                    textDecoration: 'none',
                    color: theme.palette.text.primary,
                    display: open ? "block" : "none",
                  }}
                  component={Link}
                  to={"/profile"}
                >
                  {truncateText(user?.fullName) || truncateText(user?.email) || "User"}
                  <Typography variant="body2" fontSize={"12px"}>Xem trang cá nhân</Typography>
                </Typography>
              </Tooltip>
            </Grid>
            <Grid
              item
              xs={3}
              sx={{
                display: open ? "flex" : "none",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ModeSelectV2/>
              <Tooltip title="Đăng xuất">
                <Button
                  sx={{minWidth: 0, padding: 0, width: "100%", height: "100%", borderRadius: 2}}
                  onClick={() => auth.logout()}
                >
                  <MdLogout/>
                </Button>
              </Tooltip>
            </Grid>
          </Grid>
        </Box>
      </Drawer>
    </>
  );
}

function truncateText(str) {
  return str?.length > 15 ? str?.split(" ")?.splice(-1)?.join(" ") : str;
}