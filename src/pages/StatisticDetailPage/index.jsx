import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getReportByCourseClass} from "~/services/app.service.js";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {IoIosArrowBack, IoIosCheckmarkCircle} from "react-icons/io";
import {
  Icon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import {moment} from "~/utils/moment.js";
import {TbTargetArrow} from "react-icons/tb";
import {FaRegCircleCheck, FaRegCircleQuestion} from "react-icons/fa6";
import {GoPeople} from "react-icons/go";
import {getRankItemColor, getRankItemTextColor} from "~/components/RankingList/index.jsx";
import * as React from "react";
import {IoCloseCircleOutline} from "react-icons/io5";

export default function StatisticDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [rankingList, setRankingList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getReportByCourseClass(id);
      setReport(res?.metadata);
      setRankingList(res?.metadata?.rankList || []);
    }
    fetchData();
  }, []);

  return (
    <Box
      sx={{

      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 1,
          justifyContent: "flex-start",
          alignItems: "center",
          marginBottom: 2
        }}
      >
        <Button
          sx={{
            padding: 1
          }}
          onClick={() => navigate(-1)}
        >
          <IoIosArrowBack/>
        </Button>
        <Typography
          variant="h5"
          fontWeight={700}
        >
          {report?.courseClass}
        </Typography>
        {/*<Tooltip title={"Lớp học phần"}>*/}
        {/*  <Chip*/}
        {/*    variant={"filled"}*/}
        {/*    icon={<Class sx={{width: "20px", height: "20px"}}/>}*/}
        {/*    label={"CNTT64B"}*/}
        {/*    color={"warning"}*/}
        {/*  />*/}
        {/*</Tooltip>*/}
      </Box>
      <Box
        sx={{
          padding: 3,
          backgroundColor: "#F2F7FDFF",
          borderRadius: 3
        }}
      >
        <Typography
          variant={"h6"}
          fontWeight={700}
          color={"#1A4E8DFF"}
          sx={{
            marginBottom: 2
          }}
        >
          Tổng quan
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "space-around",
          }}
        >
          <Box
            sx={{
              padding: 2,
              border: "1px solid #ADCBF0FF",
              borderRadius: 1,
              backgroundColor: "#FFFFFFFF",
              display: "flex",
              gap: 1,
              alignItems: "center",
              flexBasis: "25%",
              width: "100%"
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#ADCBF0FF",
                padding: 1,
                borderRadius: 1,
                width: "fit-content",
                height: "fit-content"
              }}
            >
              <Icon as={GoPeople} sx={{color: "#1A4E8DFF", width: "35px", height: "35px"}}/>
            </Box>
            <Box>
              <Typography
                variant={"body2"}
                color={"#1A4E8DFF"}
              >
                Số sinh viên tham gia
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                }}
              >
                <Typography
                  variant={"h5"}
                  fontWeight={700}
                  color={"#1A4E8DFF"}
                >
                  {report?.registeredCount}
                </Typography>
                <Typography
                  variant={"body1"}
                  fontWeight={700}
                  color={"#1A4E8DFF"}
                >
                  /{report?.studentCount}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              padding: 2,
              border: "1px solid #ADCBF0FF",
              borderRadius: 1,
              backgroundColor: "#FFFFFFFF",
              display: "flex",
              gap: 1,
              alignItems: "center",
              flexBasis: "25%",
              width: "100%"
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#ADCBF0FF",
                padding: 1,
                borderRadius: 1,
                width: "fit-content",
                height: "fit-content"
              }}
            >
              <Icon as={FaRegCircleQuestion} sx={{color: "#1A4E8DFF", width: "35px", height: "35px"}}/>
            </Box>
            <Box>
              <Typography
                variant={"body2"}
                color={"#1A4E8DFF"}
              >
                Số câu hỏi đã làm
              </Typography>
              <Typography
                variant={"h5"}
                fontWeight={700}
                color={"#1A4E8DFF"}
              >
                {report?.totalQuestions} câu
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              padding: 2,
              border: "1px solid #ADCBF0FF",
              borderRadius: 1,
              backgroundColor: "#FFFFFFFF",
              display: "flex",
              gap: 1,
              alignItems: "center",
              flexBasis: "25%",
              width: "100%"
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#ADCBF0FF",
                padding: 1,
                borderRadius: 1,
                width: "fit-content",
                height: "fit-content"
              }}
            >
              <Icon as={FaRegCircleCheck} sx={{color: "#1A4E8DFF", width: "35px", height: "35px"}}/>
            </Box>
            <Box>
              <Typography
                variant={"body2"}
                color={"#1A4E8DFF"}
              >
                Số câu đúng
              </Typography>
              <Typography
                variant={"h5"}
                fontWeight={700}
                color={"#1A4E8DFF"}
              >
                {report?.totalQuestionsCorrect} câu
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              padding: 2,
              border: "1px solid #ADCBF0FF",
              borderRadius: 1,
              backgroundColor: "#FFFFFFFF",
              display: "flex",
              gap: 1,
              alignItems: "center",
              flexBasis: "25%",
              width: "100%"
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#ADCBF0FF",
                padding: 1,
                borderRadius: 1,
                width: "fit-content",
                height: "fit-content"
              }}
            >
              <Icon as={TbTargetArrow} sx={{color: "#1A4E8DFF", width: "35px", height: "35px"}}/>
            </Box>
            <Box>
              <Typography
                variant={"body2"}
                color={"#1A4E8DFF"}
              >
                Điểm trung bình
              </Typography>
              <Typography
                variant={"h5"}
                fontWeight={700}
                color={"#1A4E8DFF"}
              >
                {String(parseFloat(report?.avgAccuracy)/10)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          marginTop: 3
        }}
      >
        <Typography variant="h5" fontWeight={700} sx={{}}>
          Bảng xếp hạng
        </Typography>
        <Box>
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
                  <TableCell align="left">MSV</TableCell>
                  <TableCell align="left">Họ tên</TableCell>
                  <TableCell align="center">
                    Số câu đã làm
                  </TableCell>
                  <TableCell align="center">
                    Số câu đúng
                  </TableCell>
                  <TableCell align="center">
                    Độ chính xác
                  </TableCell>
                  <TableCell align="center">
                    Lần cuối làm
                  </TableCell>
                  <TableCell align="center">
                    Đã có tài khoản
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rankingList.length > 0 ? rankingList.map((item, index) => {
                  return (
                    <TableRow
                      key={index}
                      sx={{
                        backgroundColor: getRankItemColor(item.index, null, item),
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      <TableCell align="center">
                        <Typography color={getRankItemTextColor(item.index, null, item)} variant="h5" fontWeight={700}>
                          {item.index}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography
                          variant="body1"
                          fontWeight={600}
                          sx={{
                            textAlign: "left",
                            color: "#323842FF"
                          }}
                        >
                          {item.student?._id}
                        </Typography>
                      </TableCell>
                      <TableCell align={"center"}>
                        <Typography
                          variant="body1"
                          fontWeight={600}
                          sx={{
                            textAlign: "left",
                            color: "#323842FF"
                          }}
                        >
                          {item?.student?.fullName}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body1" color={getRankItemTextColor(item.index, null, item)} fontWeight={700}>
                          {item.total}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body1" color={getRankItemTextColor(item.index, null, item)} fontWeight={700}>
                          {item.correct}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body1" color={getRankItemTextColor(item.index, null, item)} fontWeight={700}>
                          {item.accuracy}%
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body1" color={getRankItemTextColor(item.index, null, item)} fontWeight={700}>
                          {item.lastPractice ? moment(item.lastPractice).format("HH:mm, DD/MM/YYYY") : "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body1" color={getRankItemTextColor(item.index, null, item)} fontWeight={700}>
                          {item.isRegistered ? (
                            <Icon as={IoIosCheckmarkCircle} sx={{color: "#1A4E8DFF"}}/>
                          ) : (
                            <Icon as={IoCloseCircleOutline} sx={{color: "red"}}/>
                          )}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )
                }) : (
                  <TableRow>
                    <TableCell align="center" colSpan={6}>
                      <Typography variant="body1" sx={{color: "#9e9e9e"}}>
                        Chưa có ai trên bảng xếp hạng!
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
}