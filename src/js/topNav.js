import {getCookie, setCookie} from "./helpers/cookieFunctions.js";
import config from './config.js';
const apiUrl = config.apiUrl;

const createTopNav = (idPage = "") => {
  fetch("topNav.html")
    .then((response) => response.text())
    .then((html) => {
      const navbar = document.getElementById("topNav");
      navbar.innerHTML = html;
      if (idPage) {
        document.querySelector(`#${idPage}`).classList.add("active");
      }

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

      //!login modal
      const loginForm = document.querySelector("#login-form");
      if (loginForm) {
        const btnSubmitLogin = document.querySelector("#btnSubmitLogin");
        btnSubmitLogin.addEventListener("click", (e) => {
          const username = document.querySelector("#username").value;
          const password = document.querySelector("#password").value;

          const usernameRegex = /^(?!.*[\s!@#$%^&*()_+={}\[\]:;<>,.?/~`])\S+$/;
              if (!usernameRegex.test(username)) {
            alert("Username is invalid. (not null, no special characters, no space)");
            return;
          }
          if (!password) {
            alert("Password is invalid. (not null)");
            return;
          }

          const data = {
            username: username,
            password: password,
          };
          fetch(`${apiUrl}/auth/login`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.statusCode === 200)
              {
                alert("Login success!");
                const rememberMe = document.querySelector("#remembder-me").checked;
                setCookie("token", data.metadata.token, rememberMe ? 30 : 1);
                window.location.reload();
              }
              else
              {
                alert(data.message);
              }
            });
        });
      }
      //!end login modal

      //! logout
      const btnLogout = document.querySelector("#btn-logout");
      if (btnLogout) {
        btnLogout.addEventListener("click", (e) => {
          setCookie("token", "", -1);
          window.location.reload();
        });
      }
      //! end logout
    });
};

export default createTopNav;
