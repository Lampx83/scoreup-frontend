import {checkAuth} from "./helpers/auth.js";
import {getCookie} from "./helpers/cookieFunctions.js";
import { privateRequest } from "./databaseAPI.js";

checkAuth();

// preview avatar
let upload = document.getElementById("upload");
let chosenImage = document.getElementById("chosen-image");

if (upload && chosenImage) {
  upload.onchange = () => {
    let reader = new FileReader();
    reader.readAsDataURL(upload.files[0]);
    reader.onload=()=>{
      chosenImage.setAttribute("src",reader.result);
    }
  }
}
// end preview avatar

// get info user
const userInfo = JSON.parse(getCookie("user"));
const formEditInfoUser = document.querySelector(".form-edit-info-user");
if (userInfo && formEditInfoUser) {
  formEditInfoUser.querySelector("input[name='username']").value = userInfo.username;
  formEditInfoUser.querySelector("input[name='email']").value = userInfo.email;
  formEditInfoUser.querySelector("input[name='phone']").value = userInfo.phone;
  formEditInfoUser.querySelector("[name='occupation']").value = userInfo?.occupation;
  formEditInfoUser.querySelector("input[name='birth']").value = userInfo.birth?.split("T")[0] ? userInfo.birth?.split("T")[0] : "";
  formEditInfoUser.querySelector("[name='gender']").value = userInfo.gender ? userInfo.gender : "";

  if (userInfo.avatar)
    formEditInfoUser.querySelector(".profile-pic img").src = userInfo.avatar;

  formEditInfoUser.onsubmit = (e) => {
    e.preventDefault();
    let formData = new FormData();

    formData.append("username", formEditInfoUser.querySelector("input[name='username']").value);
    formData.append("email", formEditInfoUser.querySelector("input[name='email']").value);
    formData.append("phone", formEditInfoUser.querySelector("input[name='phone']").value);
    formData.append("occupation", formEditInfoUser.querySelector("[name='occupation']").value);
    formData.append("birth", formEditInfoUser.querySelector("input[name='birth']").value);
    formData.append("gender", formEditInfoUser.querySelector("[name='gender']").value);

    const oldPassword = formEditInfoUser.querySelector("input[name='oldPassword']").value;
    const newPassword = formEditInfoUser.querySelector("input[name='newPassword']").value;
    const confirmPassword = formEditInfoUser.querySelector("input[name='confirmNewPassword']").value;

    if (oldPassword && newPassword && confirmPassword) {
      if (newPassword !== confirmPassword) {
        alert("Password doesn't match");
        return;
      }
      formData.append("oldPassword", oldPassword);
      formData.append("newPassword", newPassword);
    }

    if (upload.files[0]) {
      formData.append("avatar", upload.files[0]);
    }
    
    privateRequest({
      endpoint: "user/edit",
      body: formData,
      method: "PATCH",
      config: {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    }).then((response) => {
      if (response.statusCode === 200) {
        alert("Edit info success");
        window.location.reload();
      }
    }).catch(error => {
      alert(error.response.data.message);
    });
  }
}
if (userInfo) {
  const userAvatar = document.querySelector(".user-avatar img");
  userAvatar.src = userInfo.avatar;

  const userName = document.querySelector(".user-name");
  userName.innerHTML = userInfo.username;
}
// end get info user