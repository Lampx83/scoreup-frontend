import * as React from 'react';
import Box from '@mui/material/Box';
import Logo from "~/assets/images/full_body_logo.png";
import LinkMui from "@mui/material/Link";
import {Link as LinkRouter} from "react-router-dom";
import {AppBar, Container, Toolbar} from "@mui/material";
import "./style.css";
import {useEffect} from "react";

export default function LecturerHeader() {

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
      <Toolbar disableGutters sx={{backgroundImage: 'none!important'}}>
        <Container maxWidth='lg' disableGutters sx={{backgroundColor: 'transparent'}}>
          <Box sx={{
            padding: '0 20px',
            backgroundColor: (theme) => (theme.palette.headerBackground),
            backdropFilter: 'blur(10px)',
            display: 'flex',
            justifyContent: 'space-between',
            height: (theme) => (theme.app.header.height),
            borderRadius: '36px',
            boxShadow: (theme) => theme.palette.boxShadow,
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
              <LinkMui
                sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'transparent',
                }}
                component={LinkRouter}
                to="/"
              >
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
          </Box>
        </Container>
      </Toolbar>
    </AppBar>
  );
}