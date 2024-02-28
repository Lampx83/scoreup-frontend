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

  // console.log(window.location.search.slice(1).split("="));
  
  const headerSection = document.querySelector(".header-section");
  const cerInfo = document.querySelector(".certificate-info__des");

  //?get certificateInfo
  const certificate = await getPage(queryObj.id);

  // console.log(certificate);

  const certificateInfo = {
    title: certificate.properties.title.title[0].plain_text,
    databaseID: certificate.properties.database_id.rich_text[0].plain_text,
    categoryID: certificate.properties.category.relation[0].id.split("-").join(""),
    section: certificate.properties.sections_info.rich_text[0].plain_text.split(";").map(item => item.split(":")[0]),
    imgSrc: certificate.properties.img.files[0]?.name,
    piority: certificate.properties.piority.number,
    description: certificate.properties.description.rich_text[0].plain_text,
  };

  const relation = await getPage(certificateInfo.categoryID);
  certificateInfo.category = relation.properties.title.title[0].plain_text;
  //?get certificateInfo

  const loading = document.querySelectorAll(".loading");
  loading.forEach(loading => {
    loading.remove();
  })

  //# render header 
  const headerInfo = document.createElement('div');
  headerInfo.classList.add('col-lg-5', 'col-12', 'mb-5');
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
      <button type="button" class="btn custom-btn" data-bs-toggle="modal" data-bs-target="#testOption">
        Full Test
      </button>
      <button type="button" class="btn custom-btn" data-bs-toggle="modal" data-bs-target="#quizOption" disabled>
        Short Quiz (Coming Soon)
      </button>
      <a href="#top" class="custom-icon bi-bookmark smoothscroll"></a>
    </div>
    `
  const headerImg = document.createElement('div');
  headerImg.classList.add('col-lg-5', 'col-12');
  headerImg.innerHTML = `
    <div class="topics-detail-block bg-white shadow-lg">
      <img
        src="${certificateInfo.imgSrc}"
        class="topics-detail-block-image img-fluid"
      />
    </div>
    `
  headerSection.appendChild(headerInfo);
  headerSection.appendChild(headerImg);
  //# end render header 

  //# render certificate detail 
  const cerDes = document.createElement('div');
  cerDes.classList.add('col-lg-8', 'col-12');
  cerDes.innerHTML = `
    <div class="col-lg-8 col-12 justify-content-start">
      <h3 class="mb-4">About ${certificateInfo.title}</h3>
      <p>${certificateInfo.description}</p>
    </div>
    `
  cerInfo.appendChild(cerDes);
  //# end render certificate detail 

  //# render popUp Test
  const tagsOption = document.querySelector(".tags-option");
  certificateInfo.section.forEach(item => {
    const option = document.createElement("div");
    option.classList.add("form-check");
    option.innerHTML = `
      <input class="form-check-input" type="checkbox" value="${item}">
      <label class="form-check-label text-white">
        ${item.split("-")[0]}
      </label>
    `
    tagsOption.appendChild(option);
  })
  //# render popUp Test 

  //# navigate popUp Test 
  const testForm = document.querySelector("#testOption");
  const testStartBtn = testForm.querySelector(".cont-btn");
  testStartBtn.onclick = () => {
    const tagOptions = testForm.querySelectorAll('input[type="checkbox"]:checked');
    let url = config.baseUrl + "/" + testForm.querySelector("#testOptionForm").getAttribute("action");
    let tagOptionsArr = [...tagOptions];
    const tags = tagOptionsArr.map(item => item.defaultValue.toLowerCase().split(" ").join("_")).join(",");
    url += `?certificateId=${queryObj.id.split("_").join("")}&tags=${tags}`;
    // console.log(url);

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

  //# navigate popUp Quiz
  const quizForm = document.querySelector("#quizOption");
  const quizStartBtn = quizForm.querySelector(".cont-btn");
  quizStartBtn.onclick = () => {
    const tagOptions = quizForm.querySelectorAll('input[type="checkbox"]:checked');
    let url = config.baseUrl + "/" + quizForm.querySelector("#quizOptionForm").getAttribute("action");
    let tagOptionsArr = [...tagOptions];
    const tags = tagOptionsArr.map(item => item.defaultValue.split(" ").join("_")).join(",");
    url += `?certificateId=${queryObj.id.split("-").join("")}&tags=${tags}`;
    window.location.href = url;
  };
  //# End navigate popUp Quiz

};

certificateDetail();
//! end get detailed certificates


//! popup quiz option 
const quizNum = document.querySelector('.quiz-prep__form input[type="number"]');
quizNum.addEventListener('input', () => {
  let val = parseInt(quizNum.value);
  if (isNaN(val) || val < 1) val = 1;
  else if (val > 99) val = 99;
  quizNum.value = val;
})
//! popup quiz option 