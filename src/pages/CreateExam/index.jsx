import {
  Box,
  Select,
  MenuItem,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useState } from "react";
import ContentExam from "../../components/ContentExam";
import SadIcon from "../../assets/images/sad.svg";
import DetectiveIcon from "../../assets/images/detectiveCat.png";
import LikeIcon from "../../assets/images/like.png";
import { Link } from "react-router-dom";
import { checkRole } from "~/helpers/checkRole";

export default function CreateExam() {
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);
  const [examTime, setExamTime] = useState("");
  const [openCancel, setOpenCancel] = useState(false);
  const [openCreateExam, setOpenCreateExam] = useState(false);
  const [openSucess, setOpenSuccess] = useState(false);
  const role = checkRole()?.checkAdmin;

  //Hủy
  const handleCancel = () => {
    setOpenCancel(true);
  };
  const handleConfirmCancel = () => {
    setOpenCancel(false);
    console.log("Đã hủy tạo ca thi");
    //quay về trang trước
  };

  //Tạo ca thi
  const handleCreateExam = () => {
    setOpenCreateExam(true);
  };

  const handleConfirmCreateExam = () => {
    setOpenCreateExam(false);
    //quay lại trang trước
    setOpenSuccess(true);
    console.log("Đã tạo ca thi thành công");
  };

  //Hoàn tất

  const handleConfirmSuccess = () => {
    setOpenSuccess(false);
    console.log("Đã sao chép đường liên kết");
  };
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
          <ContentExam />
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
          mt: 5,
          justifyContent: "flex-end",
        }}
      >
        <Button
          variant="contained"
          onClick={handleCancel}
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
        <Dialog
          open={openCancel}
          onClose={() => setOpenCancel(false)}
          PaperProps={{
            sx: {
              borderRadius: "16px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              padding: 3,
              minWidth: "400px",
              position: "relative",
              overflow: "visible",
            },
          }}
        >
          <img
            src={SadIcon}
            alt=""
            style={{
              width: "160px",
              position: "absolute",
              left: "-159px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
          <Box>
            <DialogTitle sx={{ color: "red", textAlign: "center" }}>
              Bạn có chắc muốn hủy tạo ca thi?
            </DialogTitle>
            <DialogContent
              sx={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              Các dữ liệu đã tạo sẽ bị mất.
            </DialogContent>
            <DialogActions
              sx={{
                justifyContent: "center",
                gap: 2,
              }}
            >
              <Button
                onClick={() => setOpenCancel(false)}
                sx={{
                  color: "black",
                  background: "#cececeff",
                  borderRadius: "12px",
                  width: "150px",
                }}
              >
                Quay lại
              </Button>
              <Button
                onClick={handleConfirmCancel}
                sx={{
                  color: "white",
                  background: "#123663FF",
                  borderRadius: "12px",
                  width: "150px",
                }}
                component={Link}
                to="/exam"
                state={{ role }}
              >
                Xác nhận
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
        <Button
          variant="contained"
          onClick={handleCreateExam}
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
          Tạo ca thi
        </Button>
      </Box>
      {/* Khi nhấn tạo ca thi */}
      <Dialog
        open={openCreateExam}
        onClose={() => setOpenCreateExam(false)}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            padding: 3,
            minWidth: "400px",
            position: "relative",
            overflow: "visible",
          },
        }}
      >
        <img
          src={DetectiveIcon}
          alt=""
          style={{
            width: "160px",
            position: "absolute",
            left: "-159px",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />
        <DialogTitle sx={{ color: "red", textAlign: "center" }}>
          Bạn đã hoàn tất tạo ca thi?
        </DialogTitle>
        <DialogContent
          sx={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          Nếu chưa hoàn tất, bạn vẫn có thể chỉnh sửa tiếp sau đó.
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Button
            onClick={() => setOpenCreateExam(false)}
            sx={{
              color: "black",
              background: "#cececeff",
              borderRadius: "12px",
            }}
          >
            Chưa hoàn tất
          </Button>
          {/* Khi nhấn chưa hoàn tất hiển thị về trang thi và hiện lớp đang soạn */}
          <Button
            onClick={handleConfirmCreateExam}
            sx={{
              color: "white",
              background: "#123663FF",
              borderRadius: "12px",
              width: "150px",
            }}
          >
            Hoàn tất
          </Button>
        </DialogActions>
      </Dialog>

      {/* Khi nhấn hoàn tất  */}
      <Dialog
        open={openSucess}
        onClose={() => setOpenSuccess(false)}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            padding: 3,
            minWidth: "400px",
            position: "relative",
            overflow: "visible",
          },
        }}
      >
        <img
          src={LikeIcon}
          alt=""
          style={{
            width: "250px",
            position: "absolute",
            left: "-170px",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />
        <DialogTitle sx={{ color: "red", textAlign: "center" }}>
          Bạn đã hoàn thành tạo ca thi!
        </DialogTitle>
        <DialogContent
          sx={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          Ca thi đã được hiển thị trên danh sách các ca thi.
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
          }}
        >
          <Button
            autoFocus
            onClick={handleConfirmSuccess}
            sx={{
              color: "white",
              background: "#123663FF",
              borderRadius: "12px",
              width: "150px",
            }}
          >
            Chia sẻ
          </Button>
        </DialogActions>
      </Dialog>
      {/* //khi ấn nút chia sẻ hiển thị ra đã sao chép liên kết rồi quay về trang thi */}
    </Box>
  );
}
