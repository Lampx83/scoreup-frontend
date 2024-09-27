import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {IoIosArrowBack} from "react-icons/io";
import {Chip, Icon, Pagination, Typography} from "@mui/material";
import {moment} from "~/utils/moment.js";
import * as React from "react";
import Tooltip from "@mui/material/Tooltip";
import {useNavigate} from "react-router-dom";
import {CalendarMonth, Checklist, Class, HourglassBottom} from "@mui/icons-material";
import {TbTargetArrow} from "react-icons/tb";
import {FaRegCircleCheck, FaRegCircleQuestion} from "react-icons/fa6";
import {GoPeople} from "react-icons/go";
import cookies from "~/utils/cookies.js";
import {useEffect, useState} from "react";
import {getRank} from "~/services/question.service.js";
import RankingList from "~/components/RankingList/index.jsx";
import HardestQuestions from "~/pages/LecturerPages/DetailTestPage/HardestQuestions.jsx";

export default function LecturerDetailTestPage() {
  const navigate = useNavigate();
  const [rankingList, setRankingList] = useState([]);

  useEffect(() => {
    const fetchRankingList = async () => {
      const res = await getRank();
      setRankingList(res?.metadata || []);
    }
    fetchRankingList();
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
          Điểm danh buổi 1
        </Typography>
        <Tooltip title={"Lớp học phần"}>
          <Chip
            variant={"filled"}
            icon={<Class sx={{width: "20px", height: "20px"}}/>}
            label={"CNTT64B"}
            color={"warning"}
          />
        </Tooltip>
        <Tooltip title={"Số câu hỏi"}>
          <Chip
            variant={"filled"}
            label={"10 câu"}
            color={"success"}
            icon={<Checklist sx={{width: "15px", height: "15px"}}/>}
          />
        </Tooltip>
        <Tooltip title={"Thời gian làm bài"}>
          <Chip
            variant={"filled"}
            label={"10 phút"}
            color={"info"}
            icon={<HourglassBottom sx={{width: "15px", height: "15px"}}/>}
          />
        </Tooltip>
        <Tooltip title={"Ngày bắt đầu"}>
          <Chip
            variant={"filled"}
            label={moment().format("hh:mm, DD/MM/YYYY")}
            color={"default"}
            icon={<CalendarMonth sx={{width: "20px", height: "20px"}}/>}
          />
        </Tooltip>
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
              <Icon as={TbTargetArrow} sx={{color: "#1A4E8DFF", width: "35px", height: "35px"}}/>
            </Box>
            <Box>
              <Typography
                variant={"body2"}
                color={"#1A4E8DFF"}
              >
                Độ chính xác
              </Typography>
              <Typography
                variant={"h5"}
                fontWeight={700}
                color={"#1A4E8DFF"}
              >
                10%
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
                Tỉ lệ hoàn thành
              </Typography>
              <Typography
                variant={"h5"}
                fontWeight={700}
                color={"#1A4E8DFF"}
              >
                100%
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
                  45
                </Typography>
                <Typography
                  variant={"body1"}
                  fontWeight={700}
                  color={"#1A4E8DFF"}
                >
                  /45
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
                Số câu hỏi
              </Typography>
              <Typography
                variant={"h5"}
                fontWeight={700}
                color={"#1A4E8DFF"}
              >
                20
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      {/*TODO: render table of results for each question*/}
      <Box
        sx={{
          marginTop: 3
        }}
      >
        <Typography variant="h5" fontWeight={700} sx={{}}>
          Bảng xếp hạng
        </Typography>
        <RankingList rankingList={rankingList}/>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: 1
          }}
        >
          <Pagination count={10} color="primary" />
        </Box>
      </Box>
      <Box
        sx={{
          marginTop: 3
        }}
      >
        <Typography variant="h5" fontWeight={700} sx={{}}>
          Danh sách câu hỏi
        </Typography>
      {/*  TODO: render list of question*/}
      </Box>
    </Box>
  );
}