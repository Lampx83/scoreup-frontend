import createTopNav from "./topNav.js";
import { getCookie } from "./helpers/cookieFunctions.js";
// import createFooter from './footer.js'

createTopNav("home");
// createFooter()

//! get info if user is logged in
const token = getCookie("token");
if (token) {
  const buttons = document.querySelector(".user-buttons");
  buttons.style.display = "none";
}
else 
{
  const userActions = document.querySelector(".user-actions");
  userActions.style.display = "none";
}
//! end get info if user is logged in
