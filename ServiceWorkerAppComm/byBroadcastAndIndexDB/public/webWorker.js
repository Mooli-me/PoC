// Credits: https://www.w3schools.com/HTML/html5_webworkers.asp

var counter = 0;

function count() {
  counter ++;
  postMessage(counter);
}

const timer = setInterval(count, 500);