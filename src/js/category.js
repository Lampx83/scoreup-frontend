import createTopNav from "./topNav.js";
import { getCookie } from "./helpers/cookieFunctions.js";
import { getDatabase, getPage } from "./databaseAPI.js";
// import createFooter from './footer.js'
createTopNav("home");

//! get certificates by category id
const initGetCertificatesByCategoryId = async () => {
  const queryArr = window.location.search.substring(1).split("&");
  const queryObj = {};
  queryArr.forEach((query) => {
    const [key, value] = query.split("=");
    queryObj[key] = value;
  });

  const categoryId = queryObj.id;
  const data = await getPage(categoryId);

  const categoryTitle = document.querySelectorAll(".category-title");
  categoryTitle.forEach((title) => {
    title.innerHTML = data.properties.title.title[0]?.plain_text;
  });

  const certificateIds = data.properties.certificates.relation.map(item => item.id);
  const certificates = await Promise.all(certificateIds.map(async (id) => {
    const certificate = await getPage(id);
    return certificate;
  }));

  const certificateLoading = document.querySelector("#certificate-loading");
  certificateLoading.remove();

  certificates.sort((a, b) => {
    return a.properties.piority.number - b.properties.piority.number;
  });

  certificates.forEach((certificate) => {
    const certificatesContainer = document.querySelector("#certificates-container");
    if (certificatesContainer){
      const certificateContainer = document.createElement("div");
      certificateContainer.classList.add("custom-block", "custom-block-certificates-listing", "bg-white", "shadow-lg", "mb-5");
      certificateContainer.innerHTML = `
        <div class="d-flex">
          <img src="${certificate.properties.img.files[0]?.name ? certificate.properties.img.files[0]?.name : '../img/undraw_Educator_re_ju47.png'}" class="custom-block-image img-fluid" alt="">

          <div class="custom-block-certificates-listing-info d-flex">
            <div>
              <h5 class="mb-2">${certificate.properties.title.title[0]?.plain_text}</h5>

              <h6 class="mb-2">Time: ${certificate.properties.time_limit.rich_text[0]?.plain_text ? certificate.properties.time_limit.rich_text[0]?.plain_text : 'N/A'}</h6>
              <h6 class="mb-2">Total questions: ${certificate.properties.total_question.rich_text[0]?.plain_text ? certificate.properties.total_question.rich_text[0]?.plain_text : 'N/A'}</h6>
              <h6 class="mb-2">Max score: ${certificate.properties.max_score.rich_text[0]?.plain_text ? certificate.properties.max_score.rich_text[0]?.plain_text : 'N/A'}</h6>

              <p class="mb-0">
                ${certificate.properties.description.rich_text[0]?.plain_text?.split(" ").slice(0, 20).join(" ")}...
              </p>

              <a href="certificate.html?id=${certificate.id}" class="btn custom-btn mt-3 mt-lg-4">Learn More</a>
            </div>

            <span class="badge bg-design feature-box__rounded-pill feature-box__enroll-count ms-auto">999</span>
          </div>
        </div>
      `;

      certificatesContainer.appendChild(certificateContainer);
    }
  });
};
initGetCertificatesByCategoryId();
//!end get certificates by category id
