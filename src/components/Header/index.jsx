import ModeSelect from "../ModeSelect/index.jsx";
import * as React from 'react';
import Box from '@mui/material/Box';
import Profile from "./Menus/Profile.jsx";
import Logo from "../../assets/images/full_body_logo.png";
import LinkMui from "@mui/material/Link";
import Notifications from "./Menus/Notifications/index.jsx";
import {useDispatch, useSelector} from "react-redux";
import {Link as LinkRouter} from "react-router-dom";
import {AppBar, Container, Fab, Toolbar} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from "@mui/material/IconButton";
import DrawerList from "~/components/Header/Menus/DrawerList/index.jsx";
import {toggleDrawer} from "~/redux/actions/drawerList.js";
import "./style.css";
import ButtonHighlight from "~/components/CustomComponents/ButtonHighlight/index.jsx";
import {useEffect} from "react";
import {modalLogin} from "~/redux/actions/modalLogin.js";
import LoginModal from "~/components/LoginModal/index.jsx";
import useAuth from "~/hooks/useAuth.jsx";
import {modalRegister} from "~/redux/actions/modalRegister.js";
import RegisterModal from "~/components/RegisterModal/index.jsx";

function Header() {
  const auth = useAuth();
  const dispatch = useDispatch();
  const [isScrolled, setIsScrolled] = React.useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      if (position > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <AppBar
      position={'fixed'}
      sx={{
        backgroundColor: 'transparent',
        boxShadow: 'none',
        padding: 0,
        top: 10,
        backgroundImage: 'none!important',
      }}
    >
      {/*login modal*/}
      {auth.isAuthenticated() ? "" : <><LoginModal/><RegisterModal/></>}

      <Toolbar disableGutters sx={{backgroundImage: 'none!important'}}>
        <Container maxWidth='lg' disableGutters sx={{backgroundColor: 'transparent'}}>
          <Box sx={{
            padding: '0 20px',
            backgroundColor: (theme) => (theme.palette.headerBackground),
            backdropFilter: 'blur(10px)',
            display: 'flex',
            justifyContent: 'space-between',
            height: (theme) => (theme.app.header.height),
            // border: (theme) => (`0.5px solid ${theme.palette.border}`),
            borderRadius: '36px',
            boxShadow: (theme) => ( isScrolled ? theme.palette.boxShadow : 'none'),
            ".MuiButtonBase-root": {
              fontWeight: 600
            },
            transition: 'all 0.3s ease',
          }}>
            {/*>= sm*/}
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <LinkMui sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'transparent',
              }} component={LinkRouter}>
                <img src={Logo} alt="logo" style={{ height: '40px', paddingLeft: '10px' }}/>
              </LinkMui>
            </Box>


            {/*<Box sx={{*/}
            {/*  display: {*/}
            {/*    xs: 'none',*/}
            {/*    md: 'flex',*/}
            {/*  },*/}
            {/*  justifyContent: 'space-between',*/}
            {/*  alignItems: 'center',*/}
            {/*  gap: 1,*/}
            {/*  margin: 'auto'*/}
            {/*}}>*/}
            {/*  <Button component={LinkRouter} to="/" autoCapitalize='none'>Trang chủ</Button>*/}
            {/*  <CategoriesDropdown/>*/}
            {/*  <Button component={LinkRouter} to="/" autoCapitalize='none'>Tính năng</Button>*/}
            {/*</Box>*/}

            <Box sx={{
              display: {
                xs: 'none',
                md: 'flex',
              },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 1
            }}>
              <ModeSelect/>
              {auth.isAuthenticated() ? (
                <>
                  <Notifications/>
                  <Profile/>
                </>
              ) : (
                <>
                  <ButtonHighlight onClick={() => dispatch(modalLogin(true))} >Đăng nhập</ButtonHighlight>
                  <ButtonHighlight onClick={() => dispatch(modalRegister(true))} >Đăng ký</ButtonHighlight>
                </>
              )}
            </Box>

            {/* < sm*/}
            <Box sx={{
              display: { xs: 'flex', md: 'none' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 1
            }}>
              <ModeSelect/>
              <Notifications/>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={() => dispatch(toggleDrawer(true))}
                color="inherit"
              >
                <MenuIcon sx={{
                  color: theme => theme.palette.text.primary,
                }} />
              </IconButton>
              <DrawerList/>
            </Box>
          </Box>
        </Container>
      </Toolbar>
    </AppBar>
  )
}

export default Header;