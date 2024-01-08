import createTopNav from "./topNav.js";
import { getCookie } from "./helpers/cookieFunctions.js";
import { getDatabase, getPage } from "./databaseAPI.js";
import createFooter from "./footer.js";
createTopNav("home");
createFooter();

//! get certificate detail
const certificateDetail = async () => {
  const data = await getDatabase("4949e95213e94820934b6c8b3400df97", {
    sorts: [
      {
        property: "piority",
        direction: "ascending",
      },
    ],
  });

  const queryString = window.location.search.slice(1).split("&");
  const queryObj = {};
  queryString.forEach((query) => {
    const [key, value] = query.split("=");
    queryObj[key] = decodeURIComponent(value.replace(/\+/g, " "));
  });

  console.log(queryObj.keyword);

  const certficateList = await Promise.all(
    data.map(async (item) => {
      const newObj = {
        title: item.properties.title.title[0].plain_text,
        categoryID: item.properties.category.relation[0].id.split("-").join(""),
        imgSrc: item.properties.img.files[0]?.name,
        piority: item.properties.piority.number,
        description: item.properties.description.rich_text[0].plain_text,
      };
      const relation = await getPage(newObj.categoryID);
      newObj.category = relation.properties.title.title[0].plain_text;
      return newObj;
    })
  );

  const certificateInfo = await Promise.all(
    certficateList.filter(item => queryObj.keyword == item.title)
  );

  console.log(certificateInfo.title);

  const breadCrumb = document.querySelector(".breadcrumb");
  if (breadCrumb) {
    console.log("OK");
    console.log(certificateInfo);
    breadCrumb.innerHTML = `
      <li class="breadcrumb-item">
        <a href="index.html">Homepage</a>
      </li>
      <li class="breadcrumb-item">
        <a href="index.html">${certificateInfo.category}</a>
      </li>
      <li class="breadcrumb-item text-white" aria-current="page">
        <a href="#">${certificateInfo.title}</a>
      </li>`; 
  }
};

certificateDetail();
