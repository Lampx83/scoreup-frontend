import Button from "@mui/material/Button";
import ModeSelect from "../ModeSelect/index.jsx";
import * as React from 'react';
import Box from '@mui/material/Box';
import Profile from "./Menus/Profile.jsx";
import Categories from "./Menus/Categories.jsx";
import Logo from "../../assets/images/full_body_logo.png";
import LinkMui from "@mui/material/Link";
import Notifications from "./Menus/Notifications/index.jsx";
import {useDispatch, useSelector} from "react-redux";
import {login} from "../../redux/actions/auth.js";
import {Link as LinkRouter} from "react-router-dom";
import {Container} from "@mui/material";

function Header() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <Container maxWidth='lg' sx={{
      position: 'fixed',
      top: 10,
      zIndex: 2,
      left: '50%',
      transform: 'translateX(-50%)',
    }}>
      <Box sx={{
        padding: '0 20px',
        backgroundColor: (theme) => (theme.palette.headerBackground),
        backdropFilter: 'blur(10px)',
        display: 'flex',
        justifyContent: 'space-between',
        height: (theme) => (theme.app.header.height),
        border: (theme) => (`1px solid ${theme.palette.border}`),
        borderRadius: '36px',
      }}>
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

        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1
        }}>
          <Button component={LinkRouter} to="/" autoCapitalize='none'>Home</Button>
          <Categories/>
          <ModeSelect/>
          {auth.isAuthenticated ? (
            <>
              <Notifications/>
              <Profile/>
            </>
          ) : (
            <>
              <Button onClick={() => dispatch(login())}>Sign up</Button>
              <Button onClick={() => dispatch(login())}>Login</Button>
            </>
          )}
        </Box>
      </Box>
    </Container>
  )
}

export default Header;