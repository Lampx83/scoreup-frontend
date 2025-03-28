import Box from "@mui/material/Box";
import {Card, CardActions, CardContent, Container, Typography} from "@mui/material";
import headerImg from "~/assets/images/Container 136.png";
import * as React from "react";
import {useTheme} from "@mui/material/styles";
import cookies from "~/utils/cookies.js";
import {useEffect, useState} from "react";
import {getCertificates} from "~/services/app.service.js";
import {FaHistory, FaRegClock} from "react-icons/fa";
import {FaListCheck} from "react-icons/fa6";
import Button from "@mui/material/Button";
import {getResult} from "~/services/question.service.js";
import {Link} from "react-router-dom";
import moment from "moment";

export default function ListPostTestPage() {
  const theme = useTheme();
  const user = cookies.get("user");
  const [tests, setTests] = useState([]);

  useEffect(() => {
    // fetch tests
    const fetchTest = async () => {
      const res = await getCertificates("11b1deef08a04482abaf042b4d92fc4d");
      const tests = (res.data.results.map(item => item.properties).map(item => ({
        title: item.title.title[0].plain_text,
        database_id: item.database_id.rich_text[0].plain_text,
        active: item.active.checkbox,
      })).filter(item => item.active).sort((a, b) => a.title.localeCompare(b.title)));

      for (const test of tests) {
        const result = await getResult({
          certificateId: test.database_id
        })
        test.results = result.metadata || [];
      }

      setTests(tests);
    }
    fetchTest();
  }, []);

  return (
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
            Bạn chỉ có thể làm một lượt duy nhất mỗi đề.
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
          paddingY: 5,
          marginY: 1,
          maxWidth: "100%",
          width: "100%",
          position: "relative",
          display: "flex",
          gap: 2,
        }}
      >
        {tests.map((test, index) => (
          <Card
            key={index}
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
                fontSize={"20px"}
                fontWeight={700}
                color={"#1A4E8DFF"}
              >
                {test?.title || ""}
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
                Thời gian: 60 phút
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
                <FaListCheck/>
                Số câu hỏi: 50
              </Typography>
              {test.results.length > 0 && <Typography
                variant={"body2"}
                gutterBottom
                sx={{
                  display: "flex",
                  gap: 1,
                  justifyContent: "flex-start",
                  alignItems: "center"
                }}
              >
                <FaHistory/>
                Làm vào: {moment(test?.results[0]?.start).format("HH:mm, DD/MM/YYYY")}
              </Typography>}
            </CardContent>
            <CardActions>
              {test.results.length === 0 ? <Button
                size={"small"}
                sx={{
                  backgroundColor: '#1A4E8DFF',
                  borderRadius: 5,
                  color: 'white',
                  paddingX: 1,
                  ':hover': {
                    backgroundColor: 'rgba(26,78,141,0.8)',
                    boxShadow: '0 0 10px 0 rgba(26,78,141,0.5)'
                  }
                }}
                component={Link}
                to={`/pre-test/${test.database_id}`}
              >
                Làm bài
              </Button> :
              <Button
                size={"small"}
                sx={{
                  backgroundColor: '#9095A0FF',
                  borderRadius: 5,
                  color: 'white',
                  paddingX: 1,
                  ':hover': {
                    backgroundColor: 'rgba(144,149,160,0.8)',
                    boxShadow: '0 0 10px 0 rgba(144,149,160,0.5)'
                  }
                }}
                component={Link}
                to={`/history/${test.database_id}/${test.results[0]._id}`}
              >
                Xem đáp án chi tiết
              </Button>
              }
            </CardActions>
          </Card>
        ))}
      </Box>
    </Container>
  )
}