import axios from "axios";
import cookies from "~/utils/cookies.js";

const API_URL = import.meta.env.VITE_API_URL || "https://scoreup.whoisduyviet.id.vn/api/v1/api";

export default axios.create({
  baseURL: API_URL,
  headers: {
    "Content-type": "application/json",
  }
})