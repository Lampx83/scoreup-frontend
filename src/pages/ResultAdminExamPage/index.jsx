import { Box, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {
  FaRegCalendarAlt,
  FaBullseye,
  FaCheckCircle,
  FaUsers,
  FaQuestionCircle,
} from "react-icons/fa";

export default function ResultAdminExamPage() {
  return (
    <Box>
      <Box>
        <Box display="flex" alignItems="center" gap={6} mb={2}>
          <ChevronLeftIcon />
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: "25px",
            }}
          >
            Cơ sở lập trình_02
          </Typography>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#f5f6f7", // màu nền giống ảnh
              padding: "6px 12px",
              borderRadius: "20px", // bo tròn pill
              fontWeight: 500,
              color: "#2d2f31", // chữ xám đậm
            }}
          >
            <FaRegCalendarAlt style={{ fontSize: "18px" }} />
            <Typography fontSize="14px">13:00 07/09/2025</Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          backgroundColor: "#F2F7FD",
          padding: "20px 30px",
          borderRadius: "8px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {/* Tiêu đề */}
        <Typography
          sx={{
            fontWeight: "bold",
            color: "#1A4E8D",
            fontSize: "20px",
          }}
        >
          Tổng quan
        </Typography>

        {/* Hàng chứa 4 box */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
          }}
        >
          {/* Box 1 - Độ chính xác */}
          <Box
            sx={{
              backgroundColor: "#fff",
              border: "1.5px solid #CED0F8",
              borderRadius: "8px",
              padding: "16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <Box
              sx={{
                width: "40px",
                height: "40px",
                borderRadius: "6px",
                backgroundColor: "#D6E6FA",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1A4E8D",
                fontSize: "18px",
              }}
            >
              <FaBullseye />
            </Box>
            <Box>
              <Typography sx={{ fontSize: "14px", color: "#2d2f31" }}>
                Độ chính xác
              </Typography>
              <Typography
                sx={{ fontSize: "20px", fontWeight: "bold", color: "#0d47a1" }}
              >
                63%
              </Typography>
            </Box>
          </Box>

          {/* Box 2 - Tỉ lệ hoàn thành */}
          <Box
            sx={{
              backgroundColor: "#fff",
              border: "1.5px solid #CED0F8",
              borderRadius: "8px",
              padding: "16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <Box
              sx={{
                width: "40px",
                height: "40px",
                borderRadius: "6px",
                backgroundColor: "#D6E6FA",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1A4E8D",
                fontSize: "18px",
              }}
            >
              <FaCheckCircle />
            </Box>
            <Box>
              <Typography sx={{ fontSize: "14px", color: "#2d2f31" }}>
                Tỉ lệ hoàn thành
              </Typography>
              <Typography
                sx={{ fontSize: "20px", fontWeight: "bold", color: "#0d47a1" }}
              >
                99.3%
              </Typography>
            </Box>
          </Box>

          {/* Box 3 - Số người làm bài */}
          <Box
            sx={{
              backgroundColor: "#fff",
              border: "1.5px solid #CED0F8",
              borderRadius: "8px",
              padding: "16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <Box
              sx={{
                width: "40px",
                height: "40px",
                borderRadius: "6px",
                backgroundColor: "#D6E6FA",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1A4E8D",
                fontSize: "18px",
              }}
            >
              <FaUsers />
            </Box>
            <Box>
              <Typography sx={{ fontSize: "14px", color: "#2d2f31" }}>
                Số người làm bài
              </Typography>
              <Typography
                sx={{ fontSize: "20px", fontWeight: "bold", color: "#0d47a1" }}
              >
                45
              </Typography>
            </Box>
          </Box>

          {/* Box 4 - Số câu hỏi */}
          <Box
            sx={{
              backgroundColor: "#fff",
              border: "1.5px solid #CED0F8",
              borderRadius: "8px",
              padding: "16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <Box
              sx={{
                width: "40px",
                height: "40px",
                borderRadius: "6px",
                backgroundColor: "#D6E6FA",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1A4E8D",
                fontSize: "18px",
              }}
            >
              <FaQuestionCircle />
            </Box>
            <Box>
              <Typography sx={{ fontSize: "14px", color: "#2d2f31" }}>
                Số câu hỏi
              </Typography>
              <Typography
                sx={{ fontSize: "20px", fontWeight: "bold", color: "#0d47a1" }}
              >
                30
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      {/* Phần biểu đồ và bảng điểm có thể được thêm ở đây */}
    </Box>
  );
}
