// subjects.service.js
import axios from "~/config/axios"; // axios đã config baseURL, token, headers,...

const BASE = "/subjects"; // chỉ endpoint, axios sẽ tự thêm baseURL từ config

// Lấy tất cả môn học
export const getAllSubjects = async () => {
  try {
    const res = await axios.get(BASE);
    return res.data;
  } catch (error) {
    console.error(
      "Error fetching subjects:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Lấy môn học theo ID
export const getSubjectById = async (id) => {
  try {
    const res = await axios.get(`${BASE}/${id}`);
    return res.data;
  } catch (error) {
    console.error(
      "Error fetching subject by ID:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Thêm môn học mới
export const createSubject = async (body) => {
  try {
    const res = await axios.post(BASE, body);
    return res.data;
  } catch (error) {
    console.error(
      "Error creating subject:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Cập nhật môn học
export const updateSubject = async (id, body) => {
  try {
    const res = await axios.put(`${BASE}/${id}`, body);
    return res.data;
  } catch (error) {
    console.error(
      "Error updating subject:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Xoá môn học
export const deleteSubject = async (id) => {
  try {
    const res = await axios.delete(`${BASE}/${id}`);
    return res.data;
  } catch (error) {
    console.error(
      "Error deleting subject:",
      error.response?.data || error.message
    );
    throw error;
  }
};
