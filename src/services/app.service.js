import config from "~/config.js";
import axios from "~/config/axios.js";

export const getCertificates = async () => {
  return await axios.post(`/databases/${config.DATABASE_CERTIFICATES}/query`)
}