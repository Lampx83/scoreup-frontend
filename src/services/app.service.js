import config from "~/config.js";
import axios from "~/config/axios.js";

export const getCertificates = async (id) => {
  return await axios.get(`/databases/${id || config.DATABASE_CERTIFICATES}`);
};

export const getReport = async ({
  from = null,
  to = null,
  submitCountBy = "day",
}) => {
  const queries = [];
  if (from) {
    queries.push(`from=${from}`);
  }
  if (to) {
    queries.push(`to=${to}`);
  }
  if (submitCountBy) {
    queries.push(`submitCountBy=${submitCountBy}`);
  }
  try {
    const res = await axios.get(`/app/report?${queries.join("&")}`);
    return res?.data;
  } catch (error) {
    console.error(error);
  }
};

export const getReportByCourseClass = async (id) => {
  try {
    const res = await axios.get(`/app/report/${id}`);
    return res?.data;
  } catch (error) {
    console.error(error);
  }
};
