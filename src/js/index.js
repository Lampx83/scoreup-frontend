import createTopNav from "./topNav.js";
import { getCookie } from "./helpers/cookieFunctions.js";
import { getDatabase, getPage } from "./databaseAPI.js";
// import createFooter from './footer.js'
createTopNav("home");
// createFooter()

//! get categories
const initCategories = async () => {
  const data = await getDatabase("6b0acbfcf67a4efca8093feeb59cc471", {
    sorts: [
      {
        property: "piority",
        direction: "ascending",
      }
    ]
  })
  const categories = await Promise.all(data.map(async item => {
    const category = {
      id: item.id,
      title: item.properties.title.title[0].plain_text
    };
    
    const certificates = item.properties.certificates.relation.map(async item => {
      const certificate = await getPage(item.id);
      return {
        id: certificate.id,
        title: certificate.properties.title.title[0].plain_text,
        description: certificate.properties.description.rich_text[0].plain_text,
        img: certificate.properties.img.files[0]?.name,
        attempts: certificate.properties?.attempts,
      };
    });
    category.certificates = await Promise.all(certificates);
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
          ${category.title}
        </button>
      `;
      categoriesTab.appendChild(li);


      const tabContentItemsHTML = [];
      category.certificates.forEach((certificate, index) => {
        tabContentItemsHTML.push(`
          <div class="col-lg-4 col-md-6 col-12 mb-4 mb-lg-0 mt-4">
            <div class="feature-box bg-white shadow-lg">
              <a href="certificate.html?id=${certificate.id}">
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
          </div>
        </div>
      `;

      categoriesTabContent.appendChild(tabContent);
    });
  }
}
initCategories();
//! end get categories