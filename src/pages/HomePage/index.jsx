import {Container, Grid, Typography} from "@mui/material";
import useDocumentTitle from "../../helper/useDocumentTitle.js";
import Box from "@mui/material/Box";
import image from "~/assets/images/hero.png";
import ButtonStartNow from "~/components/CustomComponents/ButtonStartNow/index.jsx";
import HeroSection from "~/components/HeroSection/index.jsx";
import "./style.css"

function HomePage() {
  useDocumentTitle("Score Up")

  return (
    <>
      <HeroSection>
        <Grid
        container
        spacing={2}
        alignItems='center'
        justifyContent='space-around'
        wrap={'wrap'}
        >
          <Grid item md={6} sm={12}>
            <Typography variant="h2" color={"white"} fontWeight="500">
              Ôn thi khó? <br/> Có Score Up lo!
            </Typography>
            <Typography variant="h5" color={"white"} fontWeight="400">
              Hãy để Score Up giúp bạn ôn thi hiệu quả hơn!
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