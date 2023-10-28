
const header = document.getElementById("header");
const heading = document.createElement("h1");
heading.textContent = "Header";
header.appendChild(heading);
const paragraph = document.createElement("p");
paragraph.textContent = "Slogan";
header.appendChild(paragraph);
const index = document.createElement("a")
index.textContent="Home"
index.href = "index.html"
header.appendChild(index);

const profile = document.createElement("a")
profile.textContent="Profile"
profile.href = "profile.html"
header.appendChild(profile);

const login = document.createElement("a")
login.textContent="Login"
login.href = "login.html"
header.appendChild(login);

const signup = document.createElement("a")
signup.textContent="Signup"
signup.href = "signup.html"
header.appendChild(signup);

const react_test = document.createElement("a")
react_test.textContent="React"
react_test.href = "react-test.html"
header.appendChild(react_test);

const vue_test = document.createElement("a")
vue_test.textContent="Vue"
vue_test.href = "vue-test.html"
header.appendChild(vue_test);

const home = document.createElement("a")
home.textContent="Home"
home.href = "home.html"
header.appendChild(home);


const footer = document.getElementById("footer");
const copyright = document.createElement("h1");
copyright.textContent = "Footer";
footer.appendChild(copyright);