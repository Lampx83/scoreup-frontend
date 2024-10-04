import Box from "@mui/material/Box";
import {FormControl, Icon, InputLabel, Select, Typography} from "@mui/material";
import headerImg from "~/assets/images/header_userhomepage.png";
import * as React from "react";
import {useEffect, useState} from "react";
import {getReport} from "~/services/app.service.js";
import {FaRegCircleCheck} from "react-icons/fa6";
import {GoPeople} from "react-icons/go";
import {LineChart} from "@mui/x-charts";
import {moment} from "~/utils/moment.js";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import ReportCard from "~/components/ReportCard/index.jsx";
import {SiGoogleclassroom} from "react-icons/si";

export default function StatisticPage() {
  const [report, setReport] = useState(null);
  const [submitCountBy, setSubmitCountBy] = useState("week");
  const [fromDate, setFromDate] = useState(moment().subtract(31, "days"));
  const [toDate, setToDate] = useState(moment());

  const handleChange = (event) => {
    setSubmitCountBy(event.target.value);
  };

  const fetchData = async () => {
    const res = await getReport({
      from: fromDate,
      to: toDate,
      submitCountBy: submitCountBy,
    });
    setReport(res.metadata);
  }

  useEffect(() => {
    fetchData();
  }, [submitCountBy]);

  return (
    <Box>
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
            Xin chào!
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
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h5" fontWeight={700}>
            Thống kê
          </Typography>
        </Box>
        <Box
          sx={{
            padding: 3,
            backgroundColor: "#F2F7FDFF",
            borderRadius: 3,
            marginTop: 3,
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
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: "column",
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
                  <Icon as={SiGoogleclassroom} sx={{color: "#1A4E8DFF", width: "35px", height: "35px"}}/>
                </Box>
                <Box>
                  <Typography
                    variant={"body2"}
                    color={"#1A4E8DFF"}
                  >
                    Số lớp
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
                      {report?.totalClass}
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
                  <Icon as={GoPeople} sx={{color: "#1A4E8DFF", width: "35px", height: "35px"}}/>
                </Box>
                <Box>
                  <Typography
                    variant={"body2"}
                    color={"#1A4E8DFF"}
                  >
                    Người dùng
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
                      {report?.totalUserCount}
                    </Typography>
                    <Typography
                      variant={"body1"}
                      fontWeight={700}
                      color={"#1A4E8DFF"}
                    >
                      /{report?.totalStudentCount}
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
                  <Icon as={FaRegCircleCheck} sx={{color: "#1A4E8DFF", width: "35px", height: "35px"}}/>
                </Box>
                <Box>
                  <Typography
                    variant={"body2"}
                    color={"#1A4E8DFF"}
                  >
                    Tổng lượt làm bài
                  </Typography>
                  <Typography
                    variant={"h5"}
                    fontWeight={700}
                    color={"#1A4E8DFF"}
                  >
                    {report?.totalSubmitCount}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "flex-end",
                  marginBottom: 2
                }}
              >
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    label="Từ"
                    value={fromDate}
                    onChange={setFromDate}
                    slotProps={{
                      textField: {
                        size: "small",
                        sx: {
                          width: 160
                        }
                      }
                    }}
                  />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    label="Đến"
                    value={toDate}
                    onChange={setToDate}
                    slotProps={{
                      textField: {
                        size: "small",
                        sx: {
                          width: 160
                        }
                      }
                    }}
                  />
                </LocalizationProvider>
                <FormControl sx={{ minWidth: 120 }} size="small">
                  <InputLabel id="count-by-lable">Theo</InputLabel>
                  <Select
                    labelId="count-by-lable"
                    id="demo-select-small"
                    value={submitCountBy}
                    label="Theo"
                    onChange={handleChange}
                  >
                    <MenuItem value="day">
                      Ngày
                    </MenuItem>
                    <MenuItem value="week">
                      Tuần
                    </MenuItem>
                    <MenuItem value="month">
                      Tháng
                    </MenuItem>
                    <MenuItem value="year">
                      Năm
                    </MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  sx={{backgroundColor: "#1A4E8DFF", color: "white"}}
                  onClick={fetchData}
                >
                  Xem
                </Button>
              </Box>
              <LineChart
                series={[
                  {
                    data: report?.submitByDay?.map(item => item?.count) || [],
                    color: "#1A4E8DFF",
                    label: "Số lượt làm bài"
                  }
                ]}
                xAxis={[
                  {
                    data: report?.submitByDay?.map(item => item._id) || [],
                    valueFormatter: (value) => value,
                    scaleType: "band",
                    tickInterval: report?.submitByDay?.map(item => item._id),
                    label: submitCountBy === "day" ? "Ngày" : submitCountBy === "week" ? "Tuần" : submitCountBy === "month" ? "Tháng" : "Năm"
                  }
                ]}
                grid={{
                  horizontal: true
                }}
                yAxis={[
                  {
                    label: "Số lượt làm bài",
                  }
                ]}
                width={800}
                height={300}
              />
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            marginTop: 2,
            justifyContent: "space-around"
          }}
        >
          {report?.reports?.map((item, index) => (
            <ReportCard key={index} report={item}/>
          ))}
        </Box>
      </Box>
    </Box>
  );
}