export function validateCreateExam(data) {
  const errors = [];

  // Kiểm tra tên và môn thi
  if (!String(data.examName || "").trim()) errors.push("Tên ca thi");
  if (!data.selectedSubject) errors.push("Môn thi");

  // Nếu tất cả trường thời gian đều trống → cho phép bỏ qua (ca thi mở)
  const noTime = !data.startTime && !data.endTime && !data.examTime;

  // Nếu có nhập 1–2 trường trong số 3 thì vẫn bắt lỗi
  if (!noTime) {
    if (!data.startTime) errors.push("Thời gian bắt đầu");
    if (!data.endTime) errors.push("Thời gian kết thúc");
    if (!data.examTime) errors.push("Thời gian thi");
  }

  // Nếu không có file → coi như ca thi công khai (ai có link cũng vào được)
  // => không bắt lỗi danh sách sinh viên nữa
  if (!data.isEditing && !data.file) {
    console.log("⚠️ Không có danh sách sinh viên → ca thi sẽ mở công khai.");
  }

  // Kiểm tra chương thi
  if (!data.checkedChapters || data.checkedChapters.length === 0) {
    errors.push("Nội dung thi (ít nhất 1 chương được chọn với số lượng > 0)");
  }

  return errors;
}
