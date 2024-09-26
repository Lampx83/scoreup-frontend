import useActiveTab from "~/hooks/useActiveTab.jsx";
import {useEffect, useState} from "react";
import {getCertificates} from "~/services/app.service.js";
import {parseCertificate} from "~/helpers/parseNotionResponseToObject.js";
import Box from "@mui/material/Box";
import {
  Container,
  Paper,
  Table, TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme
} from "@mui/material";
import CertificateCard from "~/components/CertificateCard/index.jsx";
import {getRank, getResult} from "~/services/question.service.js";
import * as React from "react";
import Loading from "~/components/Loading/index.jsx";
import headerImg from "~/assets/images/header_userhomepage.png";
import cookies from "~/utils/cookies.js";
import Avatar from "@mui/material/Avatar";

export default function DashboardPage() {
  const theme = useTheme();
  const {updateActiveTab} = useActiveTab();
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = cookies.get("user");
  const [rankingList, setRankingList] = useState([]);

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
      console.log(res?.metadata);
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
              Lướt xuống để bắt đầu luyện tập!
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
            marginBottom: 4,
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
          {/*<Box>
            {rankingList.map((item) => {
              return (
                <Box
                  key={item.index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    marginTop: 1,
                    backgroundColor: getRankItemColor(item.index),
                    padding: 2,
                    borderRadius: 5,
                    border: "1px solid #e0e0e0",
                    "&:hover": {
                      cursor: "pointer",
                      backgroundColor: "#f5f5f5",
                    }
                  }}
                >
                  <Typography color={getRankItemTextColor(item.index)} variant="h5" minWidth={"20px"} textAlign={"center"} fontWeight={700}>
                    {item.index}
                  </Typography>
                  <Avatar
                    src={item.user.avatar}
                    alt="avatar"
                  />
                  <Box>
                    <Typography variant="body1" fontSize={18} fontWeight={600}>
                      {item.user.fullName}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      marginLeft: "auto",
                    }}
                  >
                    <Typography variant="h6" fontWeight={700}>
                      {item.correct}
                    </Typography>
                    <Typography variant="body1" sx={{color: "#9e9e9e"}}>
                      câu đúng
                    </Typography>
                  </Box>
                </Box>
              )
            })}
          </Box>*/}
          <TableContainer>
            <Table
              sx={{
                minWidth: 650,
                borderCollapse: "separate",
                borderSpacing: "0 10px",
                "& .MuiTableRow-root": {
                  border: "1px solid #e0e0e0",
                  "& .MuiTableCell-root": {
                    borderTop: "1px solid #e0e0e0",
                    borderBottom: "1px solid #e0e0e0",
                  },
                  "& .MuiTableCell-root:first-of-type": {
                    borderBottomLeftRadius: 10,
                    borderTopLeftRadius: 10,
                    borderLeft: "1px solid #e0e0e0",
                  },
                  "& .MuiTableCell-root:last-of-type": {
                    borderTopRightRadius: 10,
                    borderBottomRightRadius: 10,
                    borderRight: "1px solid #e0e0e0",
                  }
                }
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center">
                    Số câu đã làm
                  </TableCell>
                  <TableCell align="center">
                    Số câu đúng
                  </TableCell>
                  <TableCell align="center">
                    Điểm số
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rankingList.map((item) => {
                  return (
                    <TableRow
                      key={item.index}
                      sx={{
                        backgroundColor: getRankItemColor(item.index, user, item),
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      <TableCell align="center">
                        <Typography color={getRankItemTextColor(item.index, user, item)} variant="h5" fontWeight={700}>
                          {item.index}
                        </Typography>
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          width: 35,
                        }}
                      >
                        <Avatar
                          src={item.user.avatar}
                          sx={{
                            width: 35,
                            height: 35,
                          }}
                          alt="avatar"
                        >
                          {item?.user?.fullName?.split(' ').slice(-1)[0][0] || "N/A"}
                        </Avatar>
                      </TableCell>
                      <TableCell align={"center"}>
                        <Typography
                          variant="body1"
                          fontWeight={600}
                          sx={{
                            textAlign: "left",
                            color: getRankItemTextColor(item.index, user, item)
                          }}
                        >
                          {item?.user?._id === user?._id ? "Bạn" : item.user.fullName}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body1" color={getRankItemTextColor(item.index, user, item)} fontWeight={700}>
                          {item.total}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body1" color={getRankItemTextColor(item.index, user, item)} fontWeight={700}>
                          {item.correct}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body1" color={getRankItemTextColor(item.index, user, item)} fontWeight={700}>
                          {item.accuracy}%
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
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

const getRankItemColor = (index, user, item) => {
  if (user && item?.user?._id === user?._id) {
    return "#1A4E8DFF";
  }
  switch (index) {
    case 1:
      return "#FFDC6EFF";
    case 2:
      return "#DEE1E6FF";
    case 3:
      return "#E6C2B8FF";
    default:
      return "#FFFFFFFF";
  }
}

const getRankItemTextColor = (index, user, item) => {
  if (user && item?.user?._id === user?._id) {
    return "#FFFFFFFF";
  }
  switch (index) {
    case 1:
      return "#9E7900FF";
    case 2:
      return "#9095A0FF";
    case 3:
      return "#B86850FF";
    default:
      return "#323842FF";
  }
}

// const rankingList = [
//   {
//     user: {
//       fullName: "Nguyễn Van A",
//       avatar: "https://www.w3schools.com/howto/img_avatar.png"
//     },
//     total: 100,
//     correct: 90,
//     createdAt: "2021-10-10T00:00:00Z",
//     index: 1,
//     accuracy: 90
//   },
//   {
//     user: {
//       fullName: "Nguyễn Van B",
//       avatar: "https://www.w3schools.com/howto/img_avatar.png",
//     },
//     total: 100,
//     correct: 80,
//     createdAt: "2021-10-10T00:00:00Z",
//     index: 2,
//     accuracy: 80
//   },
//   {
//     user: {
//       fullName: "Nguyễn Van C",
//       avatar: "https://www.w3schools.com/howto/img_avatar.png",
//     },
//     total: 100,
//     correct: 70,
//     createdAt: "2021-10-10T00:00:00Z",
//     index: 3,
//     accuracy: 70
//   },
//   {
//     user: {
//       fullName: "Nguyễn Van D",
//       avatar: "https://www.w3schools.com/howto/img_avatar.png",
//     },
//     total: 100,
//     correct: 60,
//     createdAt: "2021-10-10T00:00:00Z",
//     index: 4,
//     accuracy: 60
//   },
//   {
//     user: {
//       fullName: "Nguyễn Van E",
//       avatar: "https://www.w3schools.com/howto/img_avatar.png",
//       _id: "66f22bf5c5434edfec4e3acf"
//     },
//     total: 100,
//     correct: 50,
//     createdAt: "2021-10-10T00:00:00Z",
//     index: 5
//   },
//   {
//     user: {
//       fullName: "Nguyễn Van F",
//       avatar: "https://www.w3schools.com/howto/img_avatar.png",
//     },
//     total: 100,
//     correct: 40,
//     createdAt: "2021-10-10T00:00:00Z",
//     index: 6,
//     accuracy: 40
//   },
//   {
//     user: {
//       fullName: "Nguyễn Van G",
//       avatar: "https://www.w3schools.com/howto/img_avatar.png",
//     },
//     total: 100,
//     correct: 30,
//     createdAt: "2021-10-10T00:00:00Z",
//     index: 7,
//     accuracy: 30
//   },
//   {
//     user: {
//       fullName: "Nguyễn Van H",
//       avatar: "https://www.w3schools.com/howto/img_avatar.png",
//     },
//     total: 100,
//     correct: 20,
//     createdAt: "2021-10-10T00:00:00Z",
//     index: 8,
//     accuracy: 20
//   },
// ]