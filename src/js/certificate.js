import createTopNav from "./topNav.js";
import { getCookie } from "./helpers/cookieFunctions.js";
import { getDatabase, getPage } from "./databaseAPI.js";
import createFooter from "./footer.js";
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
  
  const header = document.querySelector("#header");
  const detail = document.querySelector("#certificate-info");

  //?get certificateInfo
  const certificate = await getPage(queryObj.id);

  const certificateInfo = {
    title: certificate.properties.title.title[0].plain_text,
    categoryID: certificate.properties.category.relation[0].id
      .split("-")
      .join(""),
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

  header.innerHTML = `       
    <div class="container">
      <div class="row justify-content-between align-items-center">
        <div class="col-lg-5 col-12 mb-5">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <a href="index.html">Homepage</a>
              </li>
              <li class="breadcrumb-item">
                <a href="index.html">${certificateInfo.category}</a>
              </li>
              <li class="breadcrumb-item text-white" aria-current="page">
                <a href="#">${certificateInfo.title}</a>
              </li>;
            </ol>
          </nav>

          <h2 class="text-white">${certificateInfo.title}</h2>

        <div class="d-flex align-items-center mt-5">
          <a
            href="quiz-option.html"
            class="btn custom-btn custom-border-btn smoothscroll me-4"
            >Take Test</a
          >
          <a href="#top" class="custom-icon bi-bookmark smoothscroll"></a>
        </div>
      </div>

      <div class="col-lg-5 col-12">
        <div class="topics-detail-block bg-white shadow-lg">
          <img
            src="${certificateInfo.imgSrc}"
            class="topics-detail-block-image img-fluid"
          />
        </div>
      </div>
    </div>
    `;

  detail.innerHTML = `        
  <div class="container">
    <div class="col-lg-8 col-12">
      <div class="row">
        <ul class="nav nav-tabs" id="myTab" role="tablist">
          <li class="nav-item" role="presentation">
            <button
              class="nav-link active"
              id="design-tab"
              data-bs-toggle="tab"
              data-bs-target="#design-tab-pane"
              type="button"
              role="tab"
              aria-controls="design-tab-pane"
              aria-selected="true"
            >
              About
            </button>
          </li>

          <li class="nav-item" role="presentation">
            <button
              class="nav-link"
              id="feedback-tab"
              data-bs-toggle="tab"
              data-bs-target="#feedback-tab-pane"
              type="button"
              role="tab"
              aria-controls="feedback-tab-pane"
              aria-selected="false"
            >
              Feedback
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div class="container">
    <div class="row">
      <div class="col-lg-8 col-12 justify-content-start">
        <h3 class="mb-4">About ${certificateInfo.title}</h3>
        <p>${certificateInfo.description}</p>
      </div>
    </div>
  </div>`
};

certificateDetail();
//! end get detailed certificates
