import {Card, CardActions, CardContent, Typography} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import {FaCalendar, FaHourglass, FaList} from "react-icons/fa";
import {moment} from "~/utils/moment.js";
import {BsFillPeopleFill} from "react-icons/bs";
import Button from "@mui/material/Button";
import {Link} from "react-router-dom";
import * as React from "react";
import {SiGoogleclassroom} from "react-icons/si";

export default function LecturerTestCard() {
  return (
    <Card
      variant={"elevation"}
      sx={{
        backgroundColor: "#F2F7FDFF",
        borderRadius: 3,
        height: "240px",
        width: "260px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      <CardContent>
        <Typography
          fontSize={"16px"}
          fontWeight={700}
          color={"#1A4E8DFF"}
          sx={{
            marginBottom: 2
          }}
        >
          Điểm danh buổi 1
        </Typography>
        <Tooltip title={"Lớp học phần"}>
          <Typography
            variant={"body2"}
            gutterBottom
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "flex-start",
              alignItems: "center"
            }}
            fontWeight={700}
          >
            <SiGoogleclassroom/>
            CNTT64B
          </Typography>
        </Tooltip>
        <Tooltip title={"Ngày bắt đầu"}>
          <Typography
            variant={"body2"}
            gutterBottom
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <FaCalendar/>
            {moment().format("hh:mm, DD/MM/YYYY")}
          </Typography>
        </Tooltip>
        <Tooltip title={"Thời gian làm bài"}>
          <Typography
            variant={"body2"}
            gutterBottom
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <FaHourglass/>
            10 phút
          </Typography>
        </Tooltip>
        <Tooltip title={"Số câu hỏi"}>
          <Typography
            variant={"body2"}
            gutterBottom
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <FaList/>
            10 câu
          </Typography>
        </Tooltip>
        <Tooltip title={"Số lượt làm bài"}>
          <Typography
            variant={"body2"}
            gutterBottom
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <BsFillPeopleFill/>
            Lượt làm: 20
          </Typography>
        </Tooltip>
      </CardContent>
      <CardActions>
        <Button
          size={"small"}
          sx={{
            backgroundColor: '#1A4E8DFF',
            borderRadius: 5,
            color: 'white',
            ':hover': {
              backgroundColor: 'rgba(26,78,141,0.8)',
              boxShadow: '0 0 10px 0 rgba(26,78,141,0.5)'
            }
          }}
          component={Link}
          to={`/lecturer/test/1`}
        >
          Chi tiết
        </Button>
      </CardActions>
    </Card>
  );
}