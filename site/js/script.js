var arrow = document.querySelector('#arrow');

arrow.addEventListener('click', () => {
    document.getElementById('bottom').scrollIntoView({behavior: "smooth", block: "start"})
    
})

var i = 0;
var txt = 'Free Internet Plugin'
var speed = 75; /* The speed/duration of the effect in milliseconds */

function typeWriter() {
  if (i < txt.length) {
    document.getElementById("title").innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
}
