import * as cookieFuntions from "./cookieFunctions.js";
import config from "../config.js";
import { privateRequest } from "../databaseAPI.js";

export const checkAuth = async () => {
  const token = cookieFuntions.getCookie("token");
  if (!token) {
    window.location.href = "index.html";
  }
  else
  {
    const data = await privateRequest({
      endpoint: "user/info",
      method: "GET"
    });
    console.log(data);
    if (data.statusCode == 200)
    {
      cookieFuntions.setCookie("user", JSON.stringify(data.metadata), 1);
    }
    else
    {
      cookieFuntions.setCookie("token", "", 1);
      cookieFuntions.setCookie("user", "", 1);
      window.location.href = "login.html";
    }
  }
}