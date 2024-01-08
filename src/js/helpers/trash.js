import { getDatabase } from "../databaseAPI.js";

const searchFunction = async () => {
  const titles = await getDatabase("4949e95213e94820934b6c8b3400df97", {
    sorts: [{ property: "piority", direction: "ascending" }],
  });

  const availableKeys = titles.map(
    (item) => item.properties.title.title[0].plain_text
  );

  const searchList = document.querySelector(".search-box__results");
  const inputBox = document.querySelector(".search-box .form-control");

  inputBox.addEventListener("input", async () => {
    searchList.classList.remove("d-none");
    const input = inputBox.value.toLowerCase();
    const filteredKeys = availableKeys.filter((keyword) =>
      keyword.toLowerCase().includes(input)
    );
    if (filteredKeys.length > 0) {
      const content = filteredKeys.map((item) => `<li>${item}</li>`);
      searchList.innerHTML = `<ul class="search-box__list mt-1">${content.join("")}</ul>`;
      searchList.querySelectorAll("li").forEach((item) => {
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
  }
  
};

searchFunction();

