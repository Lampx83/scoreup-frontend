//! timer
export const initTimerCountdown = (min, timer = undefined) => {
  let time = min * 60;
  const timer__time = document.querySelector(".timer__time")
  return timer = setInterval(() => {
    if (time <= 59) timer__time.classList.add("timer__time--red");
    let hours = Math.floor(time / 3600) > 9 ? Math.floor(time / 3600) : `0${Math.floor(time / 3600)}`;
    let minutes = Math.floor(time % 3600 / 60) > 9 ? Math.floor(time % 3600 / 60) : `0${Math.floor(time % 3600 / 60)}`;
    let seconds = time % 60 > 9 ? time % 60 : `0${time % 60}`;
    time--;
    timer__time.innerHTML = `${hours}:${minutes}:${seconds}`;
    if (time < 0) {
      clearInterval(timer);
      timer__time.innerHTML = `00:00:00`;
      timer__time.classList.remove("timer__time--red");
      document.querySelector(".btn-finish").click();
    }
  }, 1000);
}
export const initTimerCount = () => {
  let time = 0;
  const timer__time = document.querySelector(".timer__time")
  return setInterval(() => {
    let hours = Math.floor(time / 3600) > 9 ? Math.floor(time / 3600) : `0${Math.floor(time / 3600)}`;
    let minutes = Math.floor(time % 3600 / 60) > 9 ? Math.floor(time % 3600 / 60) : `0${Math.floor(time % 3600 / 60)}`;
    let seconds = time % 60 > 9 ? time % 60 : `0${time % 60}`;
    time++;
    timer__time.innerHTML = `${hours}:${minutes}:${seconds}`;
  }, 1000)
}
//! end timer