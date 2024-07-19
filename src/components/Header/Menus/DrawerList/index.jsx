import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import {List, ListItem, ListItemButton, Typography} from "@mui/material";
import {Link as LinkRouter} from "react-router-dom";
import ListItemIcon from "@mui/material/ListItemIcon";
import HomeIcon from "@mui/icons-material/Home.js";
import ListItemText from "@mui/material/ListItemText";
import CategoriesListItem from "~/components/Header/Menus/Categories/CategoriesListItem.jsx";
import Divider from "@mui/material/Divider";
import * as React from "react";
import {useDispatch, useSelector} from "react-redux";
import {closeDrawer, toggleDrawer} from "~/redux/actions/drawerList.js";
import {logoutAction} from "~/redux/actions/auth.js";
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LinkMui from "@mui/material/Link";
import Logo from "~/assets/images/icon.svg";

function DrawerList() {
  const {open} = useSelector((state) => state.drawerList);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={() => dispatch(toggleDrawer(false))}
      sx={{
        '& div.MuiPaper-root': {
          backgroundColor: (theme => theme.palette.headerBackground),
          backdropFilter: 'blur(10px)',
          backgroundImage: 'none',
        },
      }}
    >
      <Box sx={{
        width: 250,
        height: '100%',
        backgroundColor: 'transparent',
        paddingLeft: '10px'
      }} role="presentation" >
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: theme => theme.app.header.height,
          position: 'relative',
          top: 10
        }}>
          <LinkMui sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'transparent',
            textDecoration: 'none',
          }} component={LinkRouter}>
            <img src={Logo} alt="logo" style={{ height: '40px', padding: '0 16px' }}/>
            <Typography variant={'h6'} sx={{color: theme => theme.palette.primary, fontWeight: 'bold'}}>Chào buổi sáng!</Typography>
          </LinkMui>
        </Box>
        <List>
          <ListItem disablePadding>
            <ListItemButton component={LinkRouter} to="/">
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary={"Trang chủ"}/>
            </ListItemButton>
          </ListItem>
          <CategoriesListItem/>
          {auth.isAuthenticated ? (
            <>
              <Divider />
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <AccountCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Profile"}/>
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                {/*<ListItemButton component={LinkRouter} to="/logoutAction">*/}
                <ListItemButton onClick={() => dispatch(logoutAction())}>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Đăng xuất"}/>
                </ListItemButton>
              </ListItem>
            </>
          ) : (
            <>
              <Divider />
              <ListItem disablePadding>
                {/*<ListItemButton component={LinkRouter} to="/login">*/}
                <ListItemButton>
                  <ListItemIcon>
                    <LoginIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Đăng nhập"}/>
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                {/*<ListItemButton component={LinkRouter} to="/register">*/}
                <ListItemButton>
                  <ListItemIcon>
                    <HowToRegIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Đăng ký"}/>
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
        <Divider />
      </Box>
    </Drawer>
  )
}

export default DrawerList;