import useActiveTab from "~/hooks/useActiveTab.jsx";
import {useEffect, useState} from "react";
import {getCertificates} from "~/services/app.service.js";
import {parseCertificate, parseQuestion} from "~/helpers/parseNotionResponseToObject.js";
import Box from "@mui/material/Box";
import {
  Container, Grid,
  Typography,
  useTheme
} from "@mui/material";
import CertificateCard from "~/components/CertificateCard/index.jsx";
import {getRank, getResult} from "~/services/question.service.js";
import * as React from "react";
import Loading from "~/components/Loading/index.jsx";
import headerImg from "~/assets/images/header_userhomepage.png";
import cookies from "~/utils/cookies.js";
import RankingList from "~/components/RankingList/index.jsx";
import {questionsMock} from "~/assets/mock/questions.js";

export default function DashboardPage() {
  const theme = useTheme();
  const {updateActiveTab} = useActiveTab();
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = cookies.get("user");
  const [rankingList, setRankingList] = useState([]);
  
  const questionsParsed = questionsMock.map(parseQuestion)

  useEffect(() => {
    const fetchCertificates = async () => {
      const res = await getCertificates();
      let certs = (res?.data?.results?.map(item => parseCertificate(item))?.filter(item => !!item));

      for (const cert of certs) {
        const result = await getResult({
          certificateId: cert.id
        })
        cert.results = result.metadata || [];
      }

      certs = certs
        .filter(cert => cert.results.length > 0);

      setCertificates(certs);
    }
    fetchCertificates().then(() => setIsLoading(false));
    updateActiveTab('dashboard');
  }, []);

  useEffect(() => {
    const fetchRankingList = async () => {
      const res = await getRank();
      setRankingList(res?.metadata || []);
    }
    fetchRankingList();
  }, []);

  return (
    <>
      {isLoading && <Loading/>}
      <Container
        maxWidth={false}
        sx={{
          margin: "auto",
          width: "100%",
          position: "relative",
          maxWidth: theme.breakpoints.values.lg
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
        {/*<Box*/}
        {/*  sx={{*/}
        {/*    marginY: 4,*/}
        {/*    border: "1px solid #e0e0e0",*/}
        {/*    padding: 2,*/}
        {/*    borderRadius: 2,*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <Typography variant="h5" fontWeight={700} sx={{marginBottom: 2}}>*/}
        {/*    Bookmark*/}
        {/*  </Typography>*/}
        {/*  <Box sx={{ padding: 2 }}>*/}
        {/*    <Grid container spacing={2}>*/}
        {/*      {questionsParsed.map((question, index) => (*/}
        {/*        <Grid item xs={12} sm={6} md={3} key={index}>*/}
        {/*          /!*<Box sx={{ padding: 2, backgroundColor: "#FDF2F2FF", borderRadius: 2, minHeight: "100%", color: theme.palette.text.secondary, }}>*!/*/}
        {/*          /!*  <Typography variant="body1" fontWeight={600}>*!/*/}
        {/*          /!*    Cau hoi {index + 1}: Lệnh nào sau đây có thể được sử dụng để dừng vòng lặp ngay lập tức trong C?*!/*/}
        {/*          /!*  </Typography>*!/*/}
        {/*          /!*</Box>*!/*/}
        {/*          <SingleQuestion*/}
        {/*            {...question}*/}
        {/*            index={index + 1}*/}
        {/*            isSubmitted={false}*/}
        {/*            showActions={false}*/}
        {/*          />*/}
        {/*        </Grid>*/}
        {/*      ))}*/}
        {/*    </Grid>*/}
        {/*  </Box>*/}
        {/*</Box>*/}
        <Box
          sx={{
            marginY: 4,
            border: "1px solid #e0e0e0",
            padding: 2,
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" fontWeight={700} sx={{}}>
            Bảng xếp hạng
          </Typography>
          <Typography variant="body1" sx={{color: "#9e9e9e"}}>
            Bảng xếp hạng được làm mới mỗi tuần.
          </Typography>
          <Typography variant="body1" sx={{color: "#9e9e9e"}}>
            Hoàn thành ít nhất 30 câu hỏi để được hiển thị trên bảng xếp hạng.
          </Typography>
          <RankingList rankingList={rankingList} user={user}/>
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
              flexWrap: "wrap"
            }}
          >
            {certificates.length > 0 ? certificates.map((cert, index) => {
              return (
                <CertificateCard
                  key={index}
                  cert={cert}
                />
              )
            }) : (
              <Typography variant="body1" sx={{color: "#9e9e9e"}}>
                Bạn chưa có lịch sử làm bài nào
              </Typography>
            )}
          </Box>
        </Box>
      </Container>
    </>
  );
}