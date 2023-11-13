const createFooter = () => {
  fetch("footer.html")
    .then((response) => response.text())
    .then((html) => {
        const footer = document.getElementById("footer");
        footer.innerHTML = html;
        console.log(footer)
  });
}

export default createFooter