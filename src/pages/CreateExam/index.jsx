import { Box, Select, MenuItem, Typography, Button } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useState } from "react";

export default function CreateExam() {
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);
  const [examTime, setExamTime] = useState("");
  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" fontWeight={600}>
        Tạo ca thi
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: "40px",
          flexDirection: "row",
          flexWrap: "wrap",
          width: "100%",
        }}
      >
        {/* Left Column */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            flex: 1,
            width: "100%",
          }}
        >
          <Box>
            <Typography fontWeight={600} mb={1}>
              Lớp học phần
            </Typography>
            <input
              type="text"
              style={{
                width: "100%",
                height: "40px",
                padding: "5px 20px",
                fontSize: "16px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
              placeholder="Nhập mã lớp học phần"
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              gap: 3, // dùng số (theme spacing) thay vì %
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={600} mb={1}>
                Thời gian bắt đầu
              </Typography>
              <input
                type="datetime-local"
                style={{
                  width: "100%", // full parent width
                  height: "40px",
                  padding: "5px 15px",
                  fontSize: "14px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={600} mb={1}>
                Thời gian kết thúc
              </Typography>
              <input
                type="datetime-local"
                style={{
                  width: "100%",
                  height: "40px",
                  padding: "5px 15px",
                  fontSize: "14px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Right Column */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            flex: 1,
          }}
        >
          <Box>
            <Typography fontWeight={600} mb={1}>
              Môn thi
            </Typography>
            <Select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              displayEmpty
              fullWidth
              sx={{
                height: 40,
                borderRadius: "6px",
                backgroundColor: "#f9f9f9",
                "& fieldset": {
                  borderColor: "#ccc !important",
                },
                "&:hover fieldset": {
                  borderColor: "#888 !important",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "rgba(102,51,255,0.6) !important", // viền tím như ảnh
                },
              }}
              renderValue={(selected) => {
                if (selected === "") {
                  return <span style={{ color: "#999" }}>Chọn môn thi</span>;
                }
                return selected;
              }}
            >
              <MenuItem value="Cơ sở lập trình">Cơ sở lập trình</MenuItem>
              <MenuItem value="Nhập môn Công nghệ thông tin">
                Nhập môn Công nghệ thông tin
              </MenuItem>
              <MenuItem value="Lập trình Java">Lập trình Java</MenuItem>
              <MenuItem value="Khoa học dữ liệu trong Kinh tế và Kinh doanh">
                Khoa học dữ liệu trong Kinh tế và Kinh doanh
              </MenuItem>
            </Select>
          </Box>
          <Box>
            <Typography fontWeight={600} mb={1}>
              Danh sách sinh viên
            </Typography>

            <input
              accept=".xlsx,.csv"
              id="upload-student-list"
              type="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="upload-student-list">
              <Box
                component="span"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  width: "100%",
                  height: 40,
                  paddingX: 1.5,
                  fontSize: "14px",
                  color: "#666",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  cursor: "pointer",
                  backgroundColor: "#f9f9f9",
                  "&:hover": { borderColor: "#999" },
                }}
              >
                <AttachFileIcon fontSize="small" />
                {file
                  ? file.name
                  : "Tải danh sách sinh viên tham gia ca thi (.xlsx, .csv)"}
              </Box>
            </label>
          </Box>
          <Box>
            <Typography fontWeight={600} mb={1}>
              Thời gian thi
            </Typography>
            <input
              type="text"
              value={examTime}
              onChange={(e) => setExamTime(e.target.value)}
              style={{
                width: "100%",
                height: "40px",
                padding: "5px 20px",
                fontSize: "16px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                backgroundColor: "#f9f9f9",
              }}
              placeholder="Nhập thời gian thi (phút)"
            />
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mt: 50,
          justifyContent: "flex-end",
        }}
      >
        <Button
          variant="contained"
          // onClick={handleBack}
          sx={{
            backgroundColor: "#DE3B40FF",
            borderRadius: 25,
            color: "white",
            width: 125,
            height: 40,
            fontWeight: 600,
            ":hover": {
              backgroundColor: "#C12126FF",
            },
          }}
        >
          Hủy
        </Button>
        <Button
          variant="contained"
          // onClick={handleCreateExam}
          sx={{
            backgroundColor: "#1A4E8DFF",
            borderRadius: 25,
            color: "white",
            width: 125,
            height: 40,
            paddingX: 2,
            fontWeight: 600,
            ":hover": {
              backgroundColor: "#123663FF",
            },
          }}
        >
          Tạo đề thi
        </Button>
      </Box>
    </Box>
  );
}
