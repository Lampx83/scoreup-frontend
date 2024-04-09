import * as cookieFuntions from "./cookieFunctions.js";
import config from "../config.js";
import { privateRequest } from "../databaseAPI.js";

export const checkAuth = async () => {
  const token = cookieFuntions.getCookie("token");
  if (!token) {
    alert("You need to login first");
    window.history.back();
  }
  else
  {
    const data = await privateRequest({
      endpoint: "user/info",
      method: "GET"
    });
    if (data.statusCode == 200)
    {
      cookieFuntions.setCookie("user", "", -1);
      cookieFuntions.setCookie("user", JSON.stringify(data.metadata), 1);
    }
    else
    {
      cookieFuntions.setCookie("token", "", -1);
      cookieFuntions.setCookie("user", "", -1);
      window.location.href = "index.html";
    }
  }
}