import {Container, Grid, Typography} from "@mui/material";
import useDocumentTitle from "../../helper/useDocumentTitle.js";
import Box from "@mui/material/Box";
import image from "~/assets/images/hero.png";
import ButtonStartNow from "~/components/CustomComponents/ButtonStartNow/index.jsx";


function HomePage() {
  useDocumentTitle("Score Up")

  return (
    <>
      <Box sx={{
        background: theme => (`linear-gradient(180deg, ${theme.palette.sectionBackground.primary} 0%, ${theme.palette.sectionBackground.secondary} 100%)`),
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
          <Grid
            container
            spacing={2}
            alignItems='center'
            justifyContent='space-around'
            wrap={'wrap'}
          >
            <Grid item lg={6} md={12}>
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
              lg={6}
              md={12}
              display='flex'
              justifyContent='center'
              alignItems='center'
            >
              <img src={image} alt="logo" style={{ width: '100%' }}/>
            </Grid>
          </Grid>
        </Container>
      </Box>

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