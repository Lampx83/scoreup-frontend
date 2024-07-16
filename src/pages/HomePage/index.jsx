import {Container, Grid, Icon, Typography, useMediaQuery, useTheme} from "@mui/material";
import useDocumentTitle from "../../helper/useDocumentTitle.js";
import Box from "@mui/material/Box";
import heroImage from "~/assets/images/hero.png";
import featuresImage from "~/assets/images/features.png";
import ButtonStartNow from "~/components/CustomComponents/ButtonStartNow/index.jsx";
import HeroSection from "~/components/HeroSection/index.jsx";
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import TranslateIcon from '@mui/icons-material/Translate';
import "./style.css"
import {Link} from "react-router-dom";
import Button from "@mui/material/Button";

function HomePage() {
  useDocumentTitle("Score Up");
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isXs = useMediaQuery(theme.breakpoints.down('xs'));

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
            <Typography variant="h5" fontSize={"18px"} width={isSmall ? "100%" : "70%"} paddingBottom={"20px"} fontWeight="400">
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
            <img className={"floatingEntry"} src={heroImage} alt="logo" style={{ width: '100%', maxWidth: '800px' }}/>
          </Grid>
        </Grid>
      </HeroSection>

      <Box sx={{
        backgroundColor: theme => theme.palette.sectionBackground.secondary,
      }}>
        <Container
          maxWidth={'lg'}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={{
            paddingY: '36px',
            width: '100%',
          }}>

            <Typography variant="h4" color={"text.primary"} fontWeight="700" textAlign="left">
              Tính năng nổi bật
            </Typography>

            <Grid
              container
              sx={{
                display: {
                  xs: 'block',
                  sm: 'flex',
                },
              }}
            >
              <Grid
                item
                sm={12}
                md={4}
                sx={{
                  display: {
                    xs: 'block',
                    sm: 'flex',
                  },
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Box sx={{
                  backgroundColor: '#B89F52FF',
                  padding: '36px',
                  marginTop: '20px',
                  marginBottom: '24px',
                  borderRadius: '87px 87px 0px 87px',
                  color: '#171A1FFF',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  textAlign: 'center'
                }}>
                  <Typography variant="h6" fontSize="22px" fontWeight="700">
                    Hệ thống gợi ý thông minh
                  </Typography>
                  <Typography variant="p" fontSize="18px">
                    Mang đến trải nghiệm cá nhân hóa
                  </Typography>
                </Box>
                <Box sx={{
                  backgroundColor: '#72ADA2FF',
                  padding: '36px',
                  marginTop: '24px',
                  marginBottom: '20px',
                  borderRadius: '87px 0px 87px 87px',
                  color: '#171A1FFF',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  textAlign: 'center'
                }}>
                  <Typography variant="h6" fontSize="22px" fontWeight="700">
                    Mô hình đánh giá tự động
                  </Typography>
                  <Typography variant="p" fontSize="18px">
                    Theo dõi tiến độ học tập dễ dàng
                  </Typography>
                </Box>
              </Grid>

              <Grid
                item
                sm={12}
                md={4}
                sx={{
                  display: {
                    xs: 'none',
                    md: 'flex',
                  },
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    paddingY: '36px',
                    marginTop: '20px',
                    marginBottom: '24px',
                    borderRadius: '87px 87px 0px 87px',
                    color: '#171A1FFF',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <img src={featuresImage} alt="logo" />
                </Box>
              </Grid>

              <Grid
                item
                sm={12}
                md={4}
                sx={{
                  display: {
                    // xs: 'none',
                    sm: 'flex',
                  },
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Box sx={{
                  backgroundColor: '#95A42AFF',
                  padding: '36px',
                  marginTop: '20px',
                  marginBottom: '24px',
                  borderRadius: '87px 87px 87px 0px',
                  color: '#171A1FFF',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  textAlign: 'center'
                }}>
                  <Typography variant="h6" fontSize="22px" fontWeight="700">
                    Kho tài liệu phong phú
                  </Typography>
                  <Typography variant="p" fontSize="18px">
                    Học tập không còn nhàm chán
                  </Typography>
                </Box>
                <Box sx={{
                  backgroundColor: '#B86850FF',
                  padding: '36px',
                  marginTop: '24px',
                  marginBottom: '20px',
                  borderRadius: '0px 87px 87px 87px',
                  color: '#171A1FFF',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  textAlign: 'center'
                }}>
                  <Typography variant="h6" fontSize="22px" fontWeight="700">
                    Ôn tập thường xuyên
                  </Typography>
                  <Typography variant="p" fontSize="18px">
                    Hạn chế mắc lại các lỗi sai đã gặp
                  </Typography>
                </Box>
              </Grid>

            </Grid>

          </Box>
        </Container>
      </Box>

      <Box sx={{
        backgroundColor: theme => theme.palette.sectionBackground.primary,
      }}>
        <Container
          maxWidth={'lg'}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={{
            paddingY: '36px',
            width: '100%',
          }}>

            <Typography variant="h4" color={"text.primary"} fontWeight="700" textAlign="left">
              Chủ đề
            </Typography>

            <Grid
              container
              spacing={2}
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >
                <Box sx={{
                  backgroundColor: theme => theme.palette.sectionBackground.secondary,
                  padding: '24px',
                  marginY: '20px',
                  borderRadius: '24px',
                  minHeight: '250px',
                  position: 'relative',
                  width: "100%"
                }}>
                  <Icon component={WorkIcon} sx={{ fontSize: 36 }}/>
                  <Typography variant="h6" fontSize="20px" fontWeight="700" textAlign="left">
                    Chứng chỉ chuyên môn
                  </Typography>
                  <Typography variant="p" fontSize="18px">
                    GRE, DRE, ...
                  </Typography>
                  <br/>
                  <Button component={Link} to="/" variant="text" color="primary"
                    sx={{
                      marginTop: '12px',
                      position: 'absolute',
                      bottom: '24px',
                    }}
                  >
                    Xem thêm
                  </Button>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >
                <Box sx={{
                  backgroundColor: theme => theme.palette.sectionBackground.secondary,
                  padding: '24px',
                  marginY: '20px',
                  borderRadius: '24px',
                  minHeight: '250px',
                  position: 'relative',
                  width: "100%"
                }}>
                  <Icon component={SchoolIcon} sx={{ fontSize: 36 }}/>
                  <Typography variant="h6" fontSize="20px" fontWeight="700" textAlign="left">
                    Học phần Đại học
                  </Typography>
                  <Typography variant="p" fontSize="18px">
                    Nhập môn CNTT
                  </Typography>
                  <br/>
                  <Button component={Link} to="/" variant="text" color="primary"
                          sx={{
                            marginTop: '12px',
                            position: 'absolute',
                            bottom: '24px',
                          }}
                  >
                    Xem thêm
                  </Button>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >
                <Box sx={{
                  backgroundColor: theme => theme.palette.sectionBackground.secondary,
                  padding: '24px',
                  marginY: '20px',
                  borderRadius: '24px',
                  minHeight: '250px',
                  position: 'relative',
                  width: "100%"
                }}>
                  <Icon component={TranslateIcon} sx={{ fontSize: 36 }}/>
                  <Typography variant="h6" fontSize="20px" fontWeight="700" textAlign="left">
                    Chứng chỉ ngoại ngữ
                  </Typography>
                  <Typography variant="p" fontSize="18px">
                    TOEIC, SAT
                  </Typography>
                  <br/>
                  <Button component={Link} to="/" variant="text" color="primary"
                          sx={{
                            marginTop: '12px',
                            position: 'absolute',
                            bottom: '24px',
                          }}
                  >
                    Xem thêm
                  </Button>
                </Box>
              </Grid>


            </Grid>

          </Box>
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