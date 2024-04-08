let upload = document.getElementById("upload");
let chosenImage = document.getElementById("chosen-image");

upload.onchange = () => {
  let reader = new FileReader();
  reader.readAsDataURL(upload.files[0]);
  console.log(upload.files[0]);
  reader.onload=()=>{
    chosenImage.setAttribute("src",reader.result);
  }
}