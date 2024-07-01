fetch("header.html")
    .then((response) => response.text())
    .then((html) => {
        const header = document.getElementById("header");
        header.innerHTML = html;
});

fetch("footer.html")
    .then((response) => response.text())
    .then((html) => {
        const footer = document.getElementById("footer");
        footer.innerHTML = html;
});