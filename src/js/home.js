import $ from 'jquery';
window.$ = $;

import { getDatabase } from "./databaseAPI";

  //Tải các Components và đưa vào trang index
// fetch("_topNav.html")
//   .then((response) => response.text())
//   .then((html) => {
//     $("#topNav").html(html);
//   });

// fetch("_footer.html")
//   .then((response) => response.text())
//   .then((html) => {
//     $("#footer").html(html);
//   });

//Tải dữ liệu về các các level Beginner hiển thị lên trang index
getDatabase("10087f66f2404f85ac4eee90c2203dc3", {
  filter: {
    property: "Level",
    select: {
      equals: "Beginner",
    },
  },
}).then((response) => {
  $("#beginner-topic-list").empty()
  response.forEach((item) => {
    const topicID = item.id;
    const name = item.properties.Name.title[0].plain_text;
    let SVG = "";
    if (item.properties.SVG.rich_text[0] != null)
      SVG = item.properties.SVG.rich_text[0].plain_text;
    let topic = `
        <div class="card topic">
          <a href="vocabularies.html?topic=${topicID}">
            <div class="topic-img">
              ${SVG}
            </div>
          </a>
          <div class="topic-title">${name}</div>
        </div>`;
    $("#beginner-topic-list").append(topic);
  });
});

//Tải dữ liệu về các các level Intermediate hiển thị lên trang index
getDatabase("10087f66f2404f85ac4eee90c2203dc3", {
  filter: {
    property: "Level",
    select: {
      equals: "Intermediate",
    },
  },
}).then((response) => {
  $("#intermediate-topic-list").empty()
  response.forEach((item) => {
    const topicID = item.id;
    const name = item.properties.Name.title[0].plain_text;
    let SVG = "";
    if (item.properties.SVG.rich_text[0] != null)
      SVG = item.properties.SVG.rich_text[0].plain_text;
    let topic = `
    <div class="card topic">
      <a href="vocabularies.html?topic=${topicID}">
        <div class="topic-img">
          ${SVG}
        </div>
      </a>
      <div class="topic-title">${name}</div>
    </div>`;
    $("#intermediate-topic-list").append(topic);
  });
});

//Tải dữ liệu về các các level Advanced hiển thị lên trang index
getDatabase("10087f66f2404f85ac4eee90c2203dc3", {
  filter: {
    property: "Level",
    select: {
      equals: "Advanced",
    },
  },
}).then((response) => {
  $("#advanced-topic-list").empty()
  response.forEach((item) => {
    const topicID = item.id;
    const name = item.properties.Name.title[0].plain_text;
    let SVG = "";
    if (item.properties.SVG.rich_text[0] != null)
      SVG = item.properties.SVG.rich_text[0].plain_text;
    let topic = `
    <div class="card topic">
      <a href="vocabularies.html?topic=${topicID}">
        <div class="topic-img">
          ${SVG}
        </div>
      </a>
      <div class="topic-title">${name}</div>
    </div>`;
    $("#advanced-topic-list").append(topic);
  });
});

