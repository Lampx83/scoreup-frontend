import {getCookie, setCookie} from "./helpers/cookieFunctions.js";
import {getDatabase, getPage} from "./databaseAPI.js";
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
        loginForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const username = document.querySelector("#usernameLogin").value;
          const password = document.querySelector("#passwordLogin").value;

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
          setCookie("user", "", -1);
          window.location.reload();
        });
      }
      //! end logout

      //! sign up modal
      const signUpForm = document.querySelector("#sign-up-form");
      if (signUpForm)
      {
        signUpForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const username = document.querySelector("#usernameSignUp").value;
          const password = document.querySelector("#passwordSignUp").value;
          const confirmPassword = document.querySelector("#confirmPasswordSignUp").value;
          const email = document.querySelector("#emailSignUp").value;
          const fullName = document.querySelector("#fullNameSignUp").value;

          const usernameRegex = /^(?!.*[\s!@#$%^&*()_+={}\[\]:;<>,.?/~`])\S+$/;
          if (!usernameRegex.test(username)) {
            alert("Username is invalid. (not null, no special characters, no space)");
            return;
          }
          if (!password) {
            alert("Password is invalid. (not null)");
            return;
          }
          if (password !== confirmPassword) {
            alert("Password and confirm password are not the same");
            return;
          }
          if (!email) {
            alert("Email is invalid. (not null)");
            return;
          }
          if (!fullName) {
            alert("Full name is invalid. (not null)");
            return;
          }

          const data = {
            username: username,
            password: password,
            email: email,
            fullName: fullName,
          };
          fetch(`${apiUrl}/auth/register`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.statusCode === 201)
              {
                setCookie("token", data.metadata.token, 1);
                window.location.reload();
              }
              else
              {
                alert(data.message);
              }
            });
        });
      }
      //! end sign up modal

      //! get categories
      const dropdownCategories = document.querySelector("#dropdown-categories");
      if (dropdownCategories) {
        getDatabase("6b0acbfcf67a4efca8093feeb59cc471", {
          sorts: [
            {
              property: "piority",
              direction: "ascending",
            }
          ],
          "filter": {
            "property": "active",
            "checkbox": {
                "equals": true
            }
          }
        })
          .then(data => {
            const categorise = data.map(item => {
              return {
                id: item.id,
                title: item.properties.title.title[0].plain_text
              }
            });
            categorise.forEach(category => {
              const li = document.createElement("li");
              li.innerHTML = `<a class="dropdown-item" href="${config.baseUrl}/category.html?id=${category.id}">${category.title}</a>`;
              dropdownCategories.appendChild(li);
            })
          })
      }
      //! end get categories
    });
};

export default createTopNav;
