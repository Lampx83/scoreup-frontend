const createHeader = (idPage) => {
  fetch("header.html")
      .then((response) => response.text())
      .then((html) => {
          const header = document.getElementById("header");
          header.innerHTML = html;
      if (idPage) {
        document.querySelector(`#${idPage}`).classList.add('active');
      }
  });
} 

export default createHeader