const createTopNav = (idPage = "") => {
  fetch("topNav.html")
    .then((response) => response.text())
    .then((html) => {
      const navbar = document.getElementById("topNav");
      navbar.innerHTML = html;
      if (idPage) {
        document.querySelector(`#${idPage}`).classList.add("active");
      }
    });
};

export default createTopNav;
