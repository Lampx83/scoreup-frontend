import createTopNav from "./topNav.js";
import { getCookie } from "./helpers/cookieFunctions.js";
import { getDatabase, getPage } from "./databaseAPI.js";
import createFooter from './footer.js';
import config from "./config.js";
createTopNav("home");
createFooter();

//! get recommended certificates
const initRecommendedCertificates = async () => {
  const data = await getDatabase("4949e95213e94820934b6c8b3400df97", {
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

  const recommendedLoading = document.querySelectorAll(".recommended-loading");
  recommendedLoading.forEach(loading => {
    loading.remove();
  })

  const recommendedCertificates = data.slice(0, 2);

  const recommendedCertificatesContainer = document.querySelector("#recommended-certificate");
  const recommendedCertificate1 = document.createElement("div");
  recommendedCertificate1.classList.add("col-lg-4", "col-12", "mb-4", "mb-lg-0");
  recommendedCertificate1.innerHTML = `
    <div class="feature-box bg-white shadow-lg">
      <a href="${config.baseUrl}/certificate.html?id=${recommendedCertificates[0].id}">
        <div class="d-flex">
          <div>
            <h5>${recommendedCertificates[0].properties.title.title[0]?.plain_text}</h5>
            <p>
              ${recommendedCertificates[0].properties.description.rich_text[0]?.plain_text?.split(" ").slice(0, 20).join(" ")}...
            </p>
          </div>
          <span
            class="badge feature-box__enroll-count feature-box__rounded-pill ms-auto"
            >999</span
          >
        </div>
      </a>
    </div>
  `;

  const recommendedCertificate2 = document.createElement("div");
  recommendedCertificate2.classList.add("col-lg-6", "col-12");
  recommendedCertificate2.innerHTML = `
    <div class="feature-box feature-box-overlay">
      <div class="d-flex h-100">
        <img
          src="${recommendedCertificates[1].properties.img.files[0]?.name}"
          class="custom-block-image img-fluid"
          alt=""
        />

        <div class="feature-box-overlay__text d-flex">
          <div>
            <h5 class="text-white mb-2">
              ${recommendedCertificates[1].properties.title.title[0]?.plain_text}
            </h5>

            <p class="text-white">
              ${recommendedCertificates[1].properties.description.rich_text[0]?.plain_text?.split(" ").slice(0, 40).join(" ")}...
            </p>

            <a href="${config.baseUrl}/certificate.html?id=${recommendedCertificates[1].id}" class="btn custom-btn mt-2 mt-lg-3"
              >Learn More</a
            >
          </div>

          <span
            class="badge feature-box__enroll-count feature-box__rounded-pill ms-auto"
            >999</span
          >
        </div>

        <div class="feature-box__bg-overlay"></div>
      </div>
    </div>
  `;

  recommendedCertificatesContainer.appendChild(recommendedCertificate1);
  recommendedCertificatesContainer.appendChild(recommendedCertificate2);
};
initRecommendedCertificates();
//! end get recommended certificates

//! get categories
const initCategories = async () => {
  const data = await getDatabase("6b0acbfcf67a4efca8093feeb59cc471", {
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
  const categories = await Promise.all(data.map(async item => {
    const category = {
      id: item.id,
      title: item.properties.title.title[0].plain_text
    };
    
    const certificates = item.properties.certificates.relation.map(async item => {
      const certificate = await getPage(item.id);
      if (certificate.properties.active.checkbox !== true) {
        return null; // Skip this certificate
      }
      return {
        id: certificate.id,
        title: certificate.properties.title.title[0].plain_text,
        description: certificate.properties.description.rich_text[0].plain_text,
        img: certificate.properties.img.files[0]?.name,
        attempts: certificate.properties?.attempts,
      };
    });
    category.certificates = (await Promise.all(certificates)).filter(certificate => certificate !== null);
    return category;
  }))

  const categoriesTab = document.querySelector("#categories-tab");
  const categoriesTabContent = document.querySelector("#categories-tab-content");
  if (categoriesTab && categoriesTabContent) {

    const loadingTabs = document.querySelectorAll(".tab-loading");
    loadingTabs.forEach(loadingTab => {
      loadingTab.remove();
    })

    categories.forEach((category, index) => {
      const li = document.createElement("li");
      li.classList.add("nav-item");
      li.role = "presentation";
      li.innerHTML = `
        <button
          class="nav-link ${index === 0 ? "active" : ""}"
          id="${category.title.split(" ").join("-").toLowerCase()}-tab"
          data-bs-toggle="tab"
          data-bs-target="#${category.title.split(" ").join("-").toLowerCase()}-tab-pane"
          type="button"
          role="tab"
          aria-controls="${category.title.split(" ").join("-").toLowerCase()}-tab-pane"
          aria-selected="true"
        >
          ${category.title}(${category.certificates.length})
        </button>
      `;
      categoriesTab.appendChild(li);


      const tabContentItemsHTML = [];
      category.certificates.slice(0, 3).forEach((certificate, index) => {
        tabContentItemsHTML.push(`
          <div class="col-lg-4 col-md-6 col-12 mb-4 mb-lg-0 mt-4">
            <div class="feature-box bg-white shadow-lg">
              <a href="${config.baseUrl}/certificate.html?id=${certificate.id}">
                <div class="d-flex">
                  <div>
                    <h5 class="mb-2">${certificate.title}</h5>

                    <p class="mb-0">
                      ${certificate.description.split(" ").slice(0, 15).join(" ")}...
                    </p>
                  </div>

                  <span
                    class="badge feature-box__enroll-count feature-box__rounded-pill ms-auto"
                    >${certificate.attempts ? certificate.attempts : 999}</span
                  >
                </div>
                <img
                  src="${certificate.img ? certificate.img : "../img/undraw_Finance_re_gnv2.png"}"
                  class="feature-box-overlay__image img-fluid mt-4"
                  alt=""
                />
              </a>
            </div>
          </div>
        `);
      })

      const tabContent = document.createElement("div");
      tabContent.classList.add("col-12");
      tabContent.innerHTML = `
        <div class="tab-content">
          <div
            class="tab-pane fade ${index === 0 ? "show active" : ""}"
            id="${category.title.split(" ").join("-").toLowerCase()}-tab-pane"
            role="tabpanel"
            aria-labelledby="${category.title.split(" ").join("-").toLowerCase()}-tab"
            tabindex="0"
          >
            <div class="row">
              ${tabContentItemsHTML.join("")}
            </div>

            <div class="row justify-content-center mt-4">
              <a class="btn custom-btn mt-2 mt-lg-3 col-2 justify-content-center" href="${config.baseUrl}/category.html?id=${category.id}">
                Learn More
              </a>
            </div>
          </div>
        </div>
      `;

      categoriesTabContent.appendChild(tabContent);
    });
  }
}
initCategories();
//! end get categories