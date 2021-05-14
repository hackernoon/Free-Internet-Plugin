var arrow = document.querySelector('#arrow');

arrow.addEventListener('click', () => {
  document.getElementById('bottom').scrollIntoView({ behavior: "smooth", block: "start" })
  subPage()

})

function pageLoad() {
  type('mainTitle', 'Free Internet Plugin', 50)
  repo()
  contribs()
}


function type(id, text, speed) {
  var i = 0;
  var txt = text;
  document.getElementById(id).innerHTML = ""

  typeWriter()

  function typeWriter() {
    if (i < txt.length) {
      document.getElementById(id).innerHTML += txt.charAt(i);
      i++;
      setTimeout(typeWriter, speed);
    }
  }
}

function subPage() {
  type("whyTitle", "Why?", 200)
  type("whoTitle", "Who?", 200)
  window.onscroll = null;

}

const repo = async () => {
  await fetch('https://api.github.com/repos/hackernoon/Free-Internet-Plugin').then(response => response.json())
    .then(data => {
      document.getElementById("repo").innerHTML = `Stars: ${data.stargazers_count} -  Forks: ${data.forks}  -  Watchers: ${data.subscribers_count}`
    })
}

const contribs = async () => {
  await fetch('https://api.github.com/repos/hackernoon/Free-Internet-Plugin/contributors').then(response => response.json())
    .then(data => {
      for (let i = 0; i < data.length; i++) {
        console.log(data[i])

        let row = document.createElement("a")
        row.href = data[i].html_url
        row.style.cssText = "display: flex; height: 5em; width: 80%; align-items: center; margin-bottom: 1em;"
      
        var list = document.getElementById('contributors')
        let listItem = document.createElement('div')
        listItem.style.cssText = "display: flex; height: 5em; align-items: center; justify-content: space-between; text-align: center;"
      
        let image = document.createElement('img')
        //image.src = data[i].avatar_url
        image.src = data[i].avatar_url
        image.style.cssText = "height: 5em; width: auto; border-radius: 2.5em; border: 2px solid #0F0; margin-right: 1em;"
      
        let title = document.createElement("h1")
        title.innerHTML = data[i].login
        title.style.cssText = "text-decoration: none;"
      
        listItem.appendChild(image)
        listItem.appendChild(title)
        row.appendChild(listItem)

      
        list.appendChild(row)

      }
    })
}
