import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Select,
  Typography,
  InputAdornment,
} from "@mui/material";
import { getSubjects } from "~/services/exam.service.js";
import SearchIcon from "@mui/icons-material/Search";

export default function ExamFilter({
  searchText,
  setSearchText,
  subjectFilter,
  setSubjectFilter,
  statusFilter,
  setStatusFilter,
  role,
}) {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await getSubjects();
        setSubjects(res || []);
      } catch (err) {
        console.error("Lỗi load subjects:", err);
      }
    };
    fetchSubjects();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        flexWrap: "wrap",
        marginBottom: 3,
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* tìm kiếm */}
      <TextField
        placeholder="Tìm kiếm ca thi..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        size="small"
        sx={{ minWidth: "25%", height: 40 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      {/* Dropdown chọn môn */}
      {subjects.length > 0 ? (
        <Select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          displayEmpty
          size="small"
          sx={{
            width: "200px",
            height: 40,
            borderRadius: "6px",
            backgroundColor: "#fff",
            "& fieldset": { borderColor: "#ccc !important" },
          }}
          renderValue={(value) =>
            value === "all" ? (
              <span style={{ color: "#999" }}>Tất cả các môn thi</span>
            ) : (
              subjects.find((s) => String(s._id) === String(value))
                ?.subject_name || value
            )
          }
        >
          <MenuItem value="all">Tất cả môn thi</MenuItem>
          {subjects.map((s) => (
            <MenuItem key={s._id} value={s.subject_name}>
              {s.subject_name}
            </MenuItem>
          ))}
        </Select>
      ) : (
        <Typography color="text.secondary">Đang tải môn thi...</Typography>
      )}

      {/* Dropdown trạng thái */}
      {role && (
        <TextField
          select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          size="small"
          sx={{
            minWidth: "20%",
            height: 40,
            borderRadius: "6px",
            backgroundColor: "#fff",
            "& fieldset": { borderColor: "#ccc !important" },
          }}
        >
          <MenuItem value="all">
            <span style={{ color: "#999" }}>Tất cả các ca thi</span>
          </MenuItem>

          <MenuItem value="ready">Sẵn sàng thi</MenuItem>
          <MenuItem value="draft">Đang soạn</MenuItem>
          <MenuItem value="DONE">Đã kết thúc</MenuItem>
        </TextField>
      )}
    </Box>
  );
}
