export function validateCreateExam(data) {
  const errors = [];

  if (!String(data.examName || "").trim()) errors.push("Tên ca thi");
  if (!data.selectedSubject) errors.push("Môn thi");
  if (!data.startTime) errors.push("Thời gian bắt đầu");
  if (!data.endTime) errors.push("Thời gian kết thúc");
  if (!String(data.examTime || "").trim()) errors.push("Thời gian thi");

  if (!data.isEditing && !data.file) {
    errors.push("Danh sách sinh viên");
  }

  if (!data.checkedChapters || data.checkedChapters.length === 0) {
    errors.push("Nội dung thi (ít nhất 1 chương được chọn với số lượng > 0)");
  }

  return errors;
}
