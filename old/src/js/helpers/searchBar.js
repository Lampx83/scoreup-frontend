import { getDatabase } from "../databaseAPI.js";
import config from "../config.js";

const searchFunction = async () => {
  const data = await getDatabase("4949e95213e94820934b6c8b3400df97", {
    sorts: [{ property: "piority", direction: "ascending" }],
    filter: {
      property: "active",
      checkbox: {
        equals: true,
      },
    },
  });

  const availableKeys = data.map((item) => {
    return {
      id: item.id,
      title: item.properties.title.title[0].plain_text,
    };
  });

  const searchList = document.querySelector(".search-box__results");
  const inputBox = document.querySelector(".search-box .form-control");

  inputBox.addEventListener("input", async () => {
    searchList.classList.remove("d-none");
    const input = inputBox.value.toLowerCase();
    const filteredKeys = availableKeys.filter((keyword) => 
      keyword.title.toLowerCase().includes(input),
    );
    console.log(filteredKeys);
    if (filteredKeys.length > 0) {
    // <li><a href="${/certificate.html?id=${item.id}}"><li>${item.title}</li></a></li>

      const content = filteredKeys.map((item) => `<a href="${config.baseUrl}/certificate.html?id=${item.id}"><li>${item.title}</li></a>`);
      searchList.innerHTML = `<ul class="search-box__list mt-1 flex-column">${content.join("")}</ul>`;
      searchList.querySelectorAll("a").forEach((item) => {
        console.log(item.innerText);
        item.onclick = () => {
          inputBox.value = item.innerText;
          searchList.innerHTML = "";
        };
      });
    } else {
      searchList.innerHTML = `<ul class="search-box__list mt-1"><li>${inputBox.value} Not Found</li></ul>`;
    }
  });

  document.onclick = () => {
    searchList.classList.add("d-none");
  };
};

searchFunction();
