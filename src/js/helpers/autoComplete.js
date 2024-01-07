// const searchFunction = () => {
const availableKeys = [
  'TOEIC',
  'Programming',
  'IELTS',
  'Finance',
  'DevOps',
  'Data Science',
  'Data Engineer',
  'Full Stack Dev',
  'Back-end Dev',
  'Front-end Dev'
]

const searchList = document.querySelector('.search-box__results');
const inputBox = document.querySelector('.search-box .form-control');

inputBox.onkeyup = () => {
  let res = [];
  let input = inputBox.value;
  if (input.length) {
    res = availableKeys.filter((keyword) => {
      return keyword.toLowerCase().includes(input.toLowerCase());
    });
  }
  res.length > 0 ? display(res) : display(availableKeys);
};

const selectedValue = (item) => {
  inputBox.value = item.innerHTML;
  searchList.innerHTML = '';
}

const display = (res) => {
  const content = res.map((item) => {    
    return `<li onclick=selectedValue(this)>${item}</li>`;
  })
  
  searchList.innerHTML = `<ul class="search-box__list mt-1">${content.join("")}</ul>`
}

// const availableKeys = [
//   'TOEIC',
//   'Programming',
//   'IELTS',
//   'Finance',
//   'DevOps',
//   'Data Science',
//   'Data Engineer',
//   'Full Stack Dev',
//   'Back-end Dev',
//   'Front-end Dev'
// ];

// const searchList = document.querySelector('.search-box__results');
// const inputBox = document.querySelector('.search-box .form-control');

// inputBox.addEventListener('input', handleInput);

// const handleInput = () => {

//   console.log(availableKeys);
//   const input = inputBox.value.toLowerCase();
//   const filteredKeys = availableKeys.filter(keyword =>
//     keyword.toLowerCase().includes(input)
//   );
//   display(filteredKeys.length > 0 ? filteredKeys : availableKeys);
// }

// const selectedValue = (item) => {
//   inputBox.value = item.textContent;
//   searchList.innerHTML = '';
// }

// const display = (res) => {
//   const content = res.map(item => `<li onclick="selectedValue(this)">${item}</li>`);
//   searchList.innerHTML = `<ul class="search-box__list mt-1">${content.join('')}</ul>`;
// }