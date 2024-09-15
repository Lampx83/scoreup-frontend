import {Card, CardActions, CardContent, Typography} from "@mui/material";
import {FaRegClock} from "react-icons/fa";
import {IoCheckmarkDoneSharp} from "react-icons/io5";
import Button from "@mui/material/Button";
import {moment} from "~/utils/moment.js";
import {Link} from "react-router-dom";

export default function CertificateCard({
  cert = null
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
          gutterBottom
          fontSize={"16px"}
          fontWeight={700}
          color={"#1A4E8DFF"}
        >
          {cert?.title || ""}
        </Typography>
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
          <FaRegClock/>
          Làm vào: {moment(cert?.results[0]?.createdAt).format("hh:mm, DD/MM/YYYY")}
        </Typography>
        <Typography
          variant={"body2"}
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <IoCheckmarkDoneSharp/>
          Điểm số: {cert.results[0].correct}/{cert.results[0].total}
        </Typography>
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
          to={`/history/${cert.id}`}
        >
          Chi tiết
        </Button>
      </CardActions>
    </Card>
  )
}