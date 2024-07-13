import {Container, Grid, Typography} from "@mui/material";
import ButtonStartNow from "~/components/CustomComponents/ButtonStartNow/index.jsx";
import image from "~/assets/images/hero.png";
import Box from "@mui/material/Box";

function HeroSection(innerRef) {
  return (
    <Box sx={{
      // background: theme => (`linear-gradient(180deg, ${theme.palette.sectionBackground.primary} 0%, ${theme.palette.sectionBackground.secondary} 100%)`),
      backgroundImage: theme => theme.palette.mode === 'dark' ? 'white' : 'black',
      backgroundSize: 'cover',
      backgroundPosition: 'center',

      width: '100%',
      // height: theme => (`calc(50vh - ${theme.app.header.height})`),
      height: 'fit-content',
      borderRadius: '0 0 42px 42px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: theme => (`calc(30px + ${theme.app.header.height})`),
      paddingBottom: '30px'
    }}>
      <Container
        maxWidth={'lg'}
      >
        {innerRef.children}
      </Container>
    </Box>
  )
}

export default HeroSection;