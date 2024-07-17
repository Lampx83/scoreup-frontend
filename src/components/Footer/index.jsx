import Box from "@mui/material/Box";
import {Container, Typography} from "@mui/material";
import Logo from "../../assets/images/full_body_logo.png";
import LinkMui from "@mui/material/Link";
import {Link as LinkRouter} from "react-router-dom";
import * as React from "react";
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import Button from "@mui/material/Button";

function Footer() {
  return (
    <Container
      maxWidth={'lg'}
      sx={{
        paddingY: '36px'
      }}
    >
      <LinkMui sx={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'transparent',
        justifyContent: 'center',
        marginBottom: '24px'
      }} component={LinkRouter}>
        <img src={Logo} alt="logo" style={{ height: '70px', paddingLeft: '10px' }}/>
      </LinkMui>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Typography variant={'p'}>207 Giải Phóng, Đồng Tâm, Hai Bà Trưng, Hà Nội</Typography>
          <Typography variant={'p'}>scoreup@gmail.com</Typography>
          <Typography variant={'p'}>© 2024</Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-end'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              '& a': {
                // color: theme => theme.palette.text.primary,
                textDecoration: 'none',
              }
            }}
          >
            <LinkMui component={LinkRouter} to="/">Trang chủ</LinkMui>
            <LinkMui component={LinkRouter} to="/">Tính năng</LinkMui>
            <LinkMui component={LinkRouter} to="/">Liên hệ</LinkMui>
          </Box>
          <Box sx={{
            display: 'flex',
            gap: 2,
          }}>
            <Button startIcon={<FacebookIcon/>}></Button>
            <Button startIcon={<InstagramIcon/>}></Button>
            <Button startIcon={<TwitterIcon/>}></Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default Footer;