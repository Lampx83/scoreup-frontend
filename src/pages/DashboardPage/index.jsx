import useActiveTab from "~/hooks/useActiveTab.jsx";
import { useEffect, useState } from "react";
import { getCertificates } from "~/services/app.service.js";
import {
  parseCertificate,
  parseQuestion,
} from "~/helpers/parseNotionResponseToObject.js";
import Box from "@mui/material/Box";
import { Button, Container, Grid, Typography, useTheme } from "@mui/material";
import CertificateCard from "~/components/CertificateCard/index.jsx";
import { getRank, getResult } from "~/services/question.service.js";
import * as React from "react";
import Loading from "~/components/Loading/index.jsx";
import headerImg from "~/assets/images/header_userhomepage.png";
import cookies from "~/utils/cookies.js";
import { questionsMock } from "~/assets/mock/questions.js";
import BoxItem from "~/components/BoxItem";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

export default function DashboardPage() {
  const theme = useTheme();
  const { updateActiveTab } = useActiveTab();
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = cookies.get("user");

  const questionsParsed = questionsMock.map(parseQuestion);

  useEffect(() => {
    const fetchCertificates = async () => {
      const res = await getCertificates();
      let certs = res?.data?.results
        ?.map((item) => parseCertificate(item))
        ?.filter((item) => !!item);

      for (const cert of certs) {
        const result = await getResult({
          certificateId: cert.id,
        });
        cert.results = result.metadata || [];
      }

      certs = certs.filter((cert) => cert.results.length > 0);

      setCertificates(certs);
    };
    fetchCertificates().then(() => setIsLoading(false));
    updateActiveTab("dashboard");
  }, []);

  return (
    <>
      {isLoading && <Loading />}
      <Container
        maxWidth={false}
        sx={{
          margin: "auto",
          width: "100%",
          position: "relative",
          maxWidth: theme.breakpoints.values.lg,
        }}
      >
        {/*<RecommendModal/>*/}
        <Box
          sx={{
            width: "100%",
            height: "238px",
            position: "relative",
            display: "flex",
            alignItems: "center",
            marginBottom: 4,
          }}
        >
          <Box
            sx={{
              marginLeft: 10,
              maxWidth: "50%",
              whiteSpace: "wrap",
              color: "white",
            }}
          >
            <Typography variant="h4" fontWeight={700} sx={{}}>
              Xin chào, {user?.fullName || user?.email || "meow"}!
            </Typography>
            <Typography variant="p" fontWeight={500} sx={{}}>
              Chúc bạn một ngày tốt lành!
            </Typography>
          </Box>
          <img
            src={headerImg}
            alt="header"
            style={{
              width: "100%",
              height: "238px",
              borderRadius: 15,
              objectFit: "cover",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: -1,
            }}
          />
        </Box>
        <Box
          sx={{
            marginY: 4,
            border: "1px solid #e0e0e0",
            padding: 2,
            borderRadius: 2,
            backgroundColor: "#FFFAE7FF",
          }}
        >
          <Typography variant="h5" fontWeight={700} sx={{ marginBottom: 2 }}>
            Bookmark
          </Typography>
          <Box
            sx={{
              paddingBottom: 2,
              display: "flex",
              gap: 1,
              alignItems: "center",
            }}
          >
            {/* <Grid container spacing={2}>
              {questionsParsed.map((question, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <BoxItem question={question} />
                </Grid>
              ))}
            </Grid> */}
            <Button
              className="prev-button-swiper"
              variant="text"
              sx={{ padding: 1, minWidth: 0 }}
            >
              <NavigateBeforeIcon />
            </Button>
            <Swiper
              slidesPerView={4}
              spaceBetween={30}
              pagination={{
                clickable: true,
                el: ".pagination-swiper",
              }}
              navigation={{
                nextEl: ".next-button-swiper",
                prevEl: ".prev-button-swiper",
              }}
              modules={[Pagination, Navigation]}
              className="mySwiper"
            >
              {questionsParsed.map((question, index) => (
                <SwiperSlide key={index}>
                  <BoxItem question={question} />
                </SwiperSlide>
              ))}
            </Swiper>
            <Button
              className="next-button-swiper"
              variant="text"
              sx={{ padding: 1, minWidth: 0 }}
            >
              <NavigateNextIcon />
            </Button>
          </Box>
          <Box
            className="pagination-swiper"
            sx={{ display: "flex", gap: 1, justifyContent: "center" }}
          ></Box>
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{}}>
            Lịch sử làm bài
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              marginTop: 2,
              flexWrap: "wrap",
            }}
          >
            {certificates.length > 0 ? (
              certificates.map((cert, index) => {
                return <CertificateCard key={index} cert={cert} />;
              })
            ) : (
              <Typography variant="body1" sx={{ color: "#9e9e9e" }}>
                Bạn chưa có lịch sử làm bài nào
              </Typography>
            )}
          </Box>
        </Box>
      </Container>
    </>
  );
}
