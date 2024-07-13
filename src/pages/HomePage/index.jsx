import {Container, Grid, Typography, useMediaQuery, useTheme} from "@mui/material";
import useDocumentTitle from "../../helper/useDocumentTitle.js";
import Box from "@mui/material/Box";
import image from "~/assets/images/hero.png";
import ButtonStartNow from "~/components/CustomComponents/ButtonStartNow/index.jsx";
import HeroSection from "~/components/HeroSection/index.jsx";
import "./style.css"

function HomePage() {
  useDocumentTitle("Score Up");
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <HeroSection>
        <Grid
        container
        spacing={2}
        alignItems='center'
        justifyContent='space-around'
        wrap={'wrap'}
        paddingTop={"20px"}
        >
          <Grid item md={6} sm={12}>
            <Typography variant="h2" fontSize={"48px"} paddingBottom={"20px"} color={"text.secondary"} lineHeight={"68px"} fontWeight="700">
              Chinh phục điểm cao cùng ScoreUp!
            </Typography>
            <Typography variant="h5" fontSize={"18px"} width={matches ? "100%" : "70%"} paddingBottom={"20px"} fontWeight="400">
              Đồng hành cùng bạn mọi lúc, mọi nơi với những bài tập được gợi ý và cá nhân hóa
            </Typography>
            <ButtonStartNow/>
          </Grid>
          <Grid
            item
            md={6}
            sm={12}
            display='flex'
            justifyContent='end'
            alignItems='center'
          >
            <img className={"floatingEntry"} src={image} alt="logo" style={{ width: '100%', maxWidth: '800px' }}/>
          </Grid>
        </Grid>
      </HeroSection>

      <Container maxWidth={'lg'}>
        <Box sx={{
          height: '10000px'
        }}>

        </Box>
      </Container>
    </>
  )
}

export default HomePage;