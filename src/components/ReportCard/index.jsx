import {Card, CardActions, CardContent, Typography} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import {FaCalendar, FaHourglass, FaList, FaQuestionCircle} from "react-icons/fa";
import {moment} from "~/utils/moment.js";
import {BsFillPeopleFill} from "react-icons/bs";
import Button from "@mui/material/Button";
import {Link} from "react-router-dom";
import * as React from "react";
import {SiGoogleclassroom} from "react-icons/si";
import {IoCheckmarkCircleSharp} from "react-icons/io5";
import {GoCheckCircleFill} from "react-icons/go";
import {RiListCheck2} from "react-icons/ri";

export default function ReportCard({
  report = null
}) {
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
            marginBottom: 2,
            display: "flex",
            gap: 1,
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <SiGoogleclassroom/>
          {report?.courseClass}
        </Typography>
        <Tooltip title={"Thành viên"}>
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
            Đã đăng kí: {report?.registeredCount}/{report?.studentCount}
          </Typography>
        </Tooltip>
        <Tooltip title={"Số câu hỏi đã làm"}>
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
            <FaQuestionCircle/>
            Đã làm: {report?.totalQuestions} câu
          </Typography>
        </Tooltip>
        <Tooltip title={"Số câu đúng"}>
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
            <GoCheckCircleFill/>
            Làm đúng: {report?.totalQuestionsCorrect} câu
          </Typography>
        </Tooltip>
        <Tooltip title={"Điểm trung bình"}>
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
            <GoCheckCircleFill/>
            Điểm trung bình: {parseFloat(report?.avgAccuracy)/10}
          </Typography>
        </Tooltip>
        <Tooltip title={"Lượt làm tuần này"}>
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
            <RiListCheck2/>
            Lượt làm tuần này: {report?.currWeekSubmitCount}
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
          to={`/lecturer/statistic/${report.courseClass}`}
        >
          Chi tiết
        </Button>
      </CardActions>
    </Card>
  );
}