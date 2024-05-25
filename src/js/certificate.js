import createTopNav from "./topNav.js";
import { getCookie } from "./helpers/cookieFunctions.js";
import { getDatabase, getPage } from "./databaseAPI.js";
import createFooter from "./footer.js";
import config from "./config.js";
createTopNav("home");
createFooter();

//! get certificate detail
const certificateDetail = async () => {
  const queryString = window.location.search.slice(1).split("&");
  if (queryString[0] === "") {
    window.location.href = "index.html";
  }
  const queryObj = {};
  queryString.forEach((query) => {
    const [key, value] = query.split("=");
    queryObj[key] = value;
  });

  const headerSection = document.querySelector(".header-section");
  const cerInfo = document.querySelector(".certificate-info__des");

  //?get certificateInfo
  const certificate = await getPage(queryObj.id);

  const certificateInfo = {
    title: certificate.properties.title.title[0]?.plain_text,
    databaseID: certificate.properties.database_id.rich_text[0]?.plain_text,
    categoryID: certificate.properties.category.relation[0]?.id
      .split("-")
      .join(""),
    section: certificate.properties.sections_info.rich_text[0]?.plain_text
      .split(";")
      .map((item) => item.split(":")[0]),
    imgSrc: certificate.properties.img.files[0]?.name,
    piority: certificate.properties?.piority.number,
    description: certificate.properties.description.rich_text[0]?.plain_text,
  };

  const relation = await getPage(certificateInfo.categoryID);
  certificateInfo.category = relation.properties.title.title[0].plain_text;
  //?get certificateInfo

  const loading = document.querySelectorAll(".loading");
  loading.forEach((loading) => {
    loading.remove();
  });

  //# render header
  const headerInfo = document.createElement("div");
  headerInfo.classList.add("col-lg-5", "col-12", "mb-5");
  headerInfo.innerHTML = `
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <a href="${config.baseUrl}/index.html">Homepage</a>
        </li>
        <li class="breadcrumb-item">
          <a href="${config.baseUrl}/index.html">${certificateInfo.category}</a>
        </li>
        <li class="breadcrumb-item text-white" aria-current="page">
          <a href="#">${certificateInfo.title}</a>
        </li>;
      </ol>
    </nav>

    <h2 class="text-white">${certificateInfo.title}</h2>

    <div class="d-flex align-items-center mt-4">  
      <button type="button" class="btn custom-btn" data-bs-toggle="modal" data-bs-target="#practiceTestOption">
        Practice Test
      </button>
      <!--<button type="button" class="btn custom-btn" onclick="window.location.href='${config.baseUrl}/test.html?certificateId=${queryObj.id}&mode=miniTest'">
        Mini Test
      </button>
      <button type="button" class="btn custom-btn" onclick="window.location.href='${config.baseUrl}/test.html?certificateId=${queryObj.id}&mode=shortTest'">
        Short Test
      </button>
      <button type="button" class="btn custom-btn" onclick="window.location.href='${config.baseUrl}/test.html?certificateId=${queryObj.id}&mode=fullTest'">
        Full Test
      </button>-->
      <button type="button" class="btn custom-btn" data-bs-toggle="modal" data-bs-target="#testOption">
        Test
      </button>
      <button type="button" class="btn custom-btn" data-bs-toggle="modal" data-bs-target="#quizOption" >
        Short Quiz
      </button>
      <a href="#top" class="custom-icon bi-bookmark smoothscroll"></a>
    </div>
    `;
  const headerImg = document.createElement("div");
  headerImg.classList.add("col-lg-5", "col-12");
  headerImg.innerHTML = `
    <div class="topics-detail-block bg-white shadow-lg">
      <img
        src="${certificateInfo.imgSrc}"
        class="topics-detail-block-image img-fluid"
      />
    </div>
    `;
  headerSection.appendChild(headerInfo);
  headerSection.appendChild(headerImg);
  //# end render header

  //# render certificate detail
  const cerDes = document.createElement("div");
  cerDes.classList.add("col-lg-8", "col-12");
  cerDes.innerHTML = `
    <div class="col-lg-8 col-12 justify-content-start">
      <h3 class="mb-4">About ${certificateInfo.title}</h3>
      <p>${certificateInfo.description}</p>
    </div>
    `;
  cerInfo.appendChild(cerDes);
  //# end render certificate detail

  //# navigate popUp Test
  const testForm = document.querySelector("#testOption");
  const testStartBtn = testForm.querySelector(".cont-btn");
  testStartBtn.onclick = () => {
    //! check if user is logged in
    const token = getCookie("token");
    if (!token) {
      const loginBtn = document.querySelector("#login-btn");
      loginBtn.click();
      return;
    }
    //! end check if user is logged in
    const mode = testForm.querySelector('input[type="radio"]:checked').value;
    let url = config.baseUrl + "/" + testForm.querySelector("#testOptionForm").getAttribute("action");
    url += `?certificateId=${queryObj.id.split("-").join("")}&mode=${mode}`;
    window.location.href = url;
  };
  //# end navigate popUp Test

  //# render popUp Practice Test
  const tagsOption = document.querySelector(".tags-option");
  certificateInfo.section.forEach((item) => {
    const option = document.createElement("div");
    option.classList.add("form-check");
    option.innerHTML = `
      <input class="form-check-input" type="checkbox" value="${item.split("-")[0]}">
      <label class="form-check-label text-white">
        ${item.split("-")[0]}
      </label>
    `;
    tagsOption.appendChild(option);
  });
  //# render popUp Practice Test

  //# navigate popUp Practice Test
  const practiceTestForm = document.querySelector("#practiceTestOption");
  const practiceTestStartBtn = practiceTestForm.querySelector(".cont-btn");
  practiceTestStartBtn.onclick = () => {
    const tagOptions = practiceTestForm.querySelectorAll(
      'input[type="checkbox"]:checked'
    );
    let url =
      config.baseUrl +
      "/" +
      practiceTestForm.querySelector("#practiceTestOptionForm").getAttribute("action");
    let tagOptionsArr = [...tagOptions];

    const tags = tagOptionsArr
      .map((item) => item.defaultValue.toLowerCase().split(" ").join("_"))
      .join(",");
    url += `?certificateId=${queryObj.id.split("_").join("")}&tags=${tags}&mode=practice`;

    //! check if user is logged in
    const token = getCookie("token");
    if (!token) {
      const loginBtn = document.querySelector("#login-btn");
      loginBtn.click();
      return;
    }
    //! end check if user is logged in

    window.location.href = url;
  };
  //# end navigate popUp Test

  const quizForm = document.querySelector("#quizOption");
  //# render popUp Quiz
  const tagsOptionQuiz = document.querySelector("#quizOptionForm");
  certificateInfo.section.forEach((item) => {
    const option = document.createElement("div");
    option.classList.add("form-check");
    option.innerHTML = `
      <input class="form-check-input skill" type="checkbox" value="${item}">
      <label class="form-check-label text-white">
        ${item.split("-")[0]}
      </label>
    `;
    tagsOptionQuiz.appendChild(option);
  });
  const quizOptions = quizForm.querySelectorAll(
    '.form-check-input[type="checkbox"].skill'
  );
  quizOptions.forEach((option) => {
    option.onclick = (event) => {
      if (event.target.checked ) {
        quizOptions.forEach((cb) => {
          if (cb !== event.target) {
            cb.disabled = true;
          }
        });
      } else {
        // Enable all checkboxes when this checkbox is unchecked
        quizOptions.forEach((cb) => {
          cb.disabled = false;
        });
      }
    };
  });
  //# render popUp Quiz

  //# navigate popUp Quiz
  const quizStartBtn = quizForm.querySelector(".cont-btn");
  quizStartBtn.onclick = () => {
    //! check if user is logged in
    const token = getCookie("token");
    if (!token) {
      const loginBtn = document.querySelector("#login-btn");
      loginBtn.click();
      return;
    }
    //! end check if user is logged in

    const showAnswerNow = quizForm.querySelector("#showAnswerNow").checked;
    const limitQs = quizForm.querySelector('input[type="number"]').value;
    const tagOptions = quizForm.querySelectorAll(
      'input[type="checkbox"]:checked.skill'
    );
    let url = config.baseUrl + "/" + quizForm.querySelector("#quizOptionForm").getAttribute("action");
    let tagOptionsArr = [...tagOptions];
    const tags = tagOptionsArr.map((item) => item.defaultValue.toLowerCase().split(" ").join("_")).join(",");

    url += `?certificateId=${queryObj.id.split("-").join("")}&tags=${tags}&limit=${limitQs}&showAnswerNow=${showAnswerNow}`;
    window.location.href = url;
  };
  //# End navigate popUp Quiz
};

certificateDetail();
//! end get detailed certificates

//! popup quiz option
const quizNum = document.querySelector('.quiz-prep__form input[type="number"]');
quizNum.addEventListener("input", () => {
  let val = parseInt(quizNum.value);
  if (isNaN(val) || val < 1) val = 1;
  else if (val > 99) val = 99;
  quizNum.value = val;
});
//! popup quiz option
