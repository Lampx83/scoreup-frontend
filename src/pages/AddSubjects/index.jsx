import { useEffect, useState } from "react";
import {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
} from "~/services/subjects.service";
import { getSubjects } from "~/services/exam.service.js";

export default function AddSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    subject_name: "",
    notion_database_id: "",
    chapters: [{ chapter: "", numbers: 0 }],
  });

  const [message, setMessage] = useState("");

  // Load subjects an toàn
  const loadSubjects = async () => {
    try {
      const res = await getSubjects(); // hoặc getAllSubjects()
      console.log("Subjects từ API:", res);
      const list = Array.isArray(res) ? res : res?.data || [];
      setSubjects(list);
    } catch (err) {
      console.error(err);
      setSubjects([]);
      setMessage("Lỗi khi tải danh sách môn học.");
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  // Thay đổi chapter
  const handleChapterChange = (i, key, val) => {
    const clone = [...form.chapters];
    clone[i][key] = key === "numbers" ? Number(val) : val;
    setForm({ ...form, chapters: clone });
  };

  // Thêm chương mới
  const addChapterField = () => {
    setForm({
      ...form,
      chapters: [...form.chapters, { chapter: "", numbers: 0 }],
    });
  };

  // Submit form
  const handleSubmit = async () => {
    try {
      if (editId) {
        await updateSubject(editId, form); // gửi toàn bộ chapters (cũ + mới)
        setMessage("Cập nhật môn học thành công!");
      } else {
        await createSubject(form);
        setMessage("Thêm môn học thành công!");
      }

      // Reset form
      setForm({
        subject_name: "",
        notion_database_id: "",
        chapters: [{ chapter: "", numbers: 0 }],
      });
      setEditId(null);
      loadSubjects();
    } catch (err) {
      console.error(err);
      setMessage("Có lỗi xảy ra khi lưu môn học.");
    }
  };

  // Nhấn Edit
  const handleEdit = async (id) => {
    try {
      const res = await getSubjectById(id);
      const data = res?.data || res;

      setForm({
        subject_name: data.subject_name || "",
        notion_database_id: data.notion_database_id || "",
        chapters:
          Array.isArray(data.chapters) && data.chapters.length > 0
            ? data.chapters.map((c) => ({
                chapter: c.chapter || "",
                numbers: Number(c.numbers) || 0,
              }))
            : [{ chapter: "", numbers: 0 }],
      });

      setEditId(id);
      setMessage("");
    } catch (err) {
      console.error(err);
      setMessage("Lỗi khi lấy thông tin môn học.");
    }
  };

  // Nhấn Delete
  const handleDelete = async (id) => {
    try {
      await deleteSubject(id);
      setMessage("Xóa môn học thành công!");
      loadSubjects();
    } catch (err) {
      console.error(err);
      setMessage("Lỗi khi xóa môn học.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Quản lý môn học</h2>

      {message && <p>{message}</p>}

      <div style={{ border: "1px solid #ccc", padding: 15, marginBottom: 20 }}>
        <input
          placeholder="Tên môn"
          value={form.subject_name}
          onChange={(e) => setForm({ ...form, subject_name: e.target.value })}
        />
        <br />

        <input
          placeholder="Notion Database ID"
          value={form.notion_database_id}
          onChange={(e) =>
            setForm({ ...form, notion_database_id: e.target.value })
          }
        />
        <br />

        <h4>Chapters</h4>
        {form.chapters.map((c, i) => (
          <div key={i} style={{ marginBottom: 5 }}>
            <input
              placeholder="chapter"
              value={c.chapter}
              onChange={(e) =>
                handleChapterChange(i, "chapter", e.target.value)
              }
            />
            <input
              type="number"
              placeholder="numbers"
              value={c.numbers}
              onChange={(e) =>
                handleChapterChange(i, "numbers", e.target.value)
              }
              style={{ width: 80, marginLeft: 5 }}
            />
          </div>
        ))}

        <button type="button" onClick={addChapterField}>
          + Thêm chương
        </button>

        <br />
        <button type="button" onClick={handleSubmit} style={{ marginTop: 10 }}>
          {editId ? "Cập nhật môn" : "Thêm môn"}
        </button>
      </div>

      <h3>Danh sách môn</h3>

      {Array.isArray(subjects) && subjects.length > 0 ? (
        subjects.map((s) => (
          <div
            key={s.notion_database_id}
            style={{
              border: "1px solid black",
              padding: 10,
              marginBottom: 10,
            }}
          >
            <strong>{s.subject_name}</strong>

            <button
              onClick={() => handleEdit(s.notion_database_id)}
              style={{ marginLeft: 10 }}
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(s.notion_database_id)}
              style={{ marginLeft: 10, color: "red" }}
            >
              Delete
            </button>
          </div>
        ))
      ) : (
        <p>Chưa có môn học nào.</p>
      )}
    </div>
  );
}
