export function validateCreateExam(data) {
  const errors = [];

  if (!data.classId?.trim()) errors.push("Mã học phần");
  if (!data.subjectId?.trim()) errors.push("Mã số lớp học phần");
  if (!data.selectedSubject) errors.push("Môn thi");
  if (!data.startTime) errors.push("Thời gian bắt đầu");
  if (!data.endTime) errors.push("Thời gian kết thúc");
  if (!data.examTime?.trim()) errors.push("Thời gian thi");
  if (!data.file) errors.push("Danh sách sinh viên");

  if (!data.checkedChapters || data.checkedChapters.length === 0) {
    errors.push("Nội dung thi (ít nhất 1 chương được chọn với số lượng > 0)");
  }

  return errors;
}
