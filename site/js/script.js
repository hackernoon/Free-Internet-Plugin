var arrow = document.querySelector('#arrow');

arrow.addEventListener('click', () => {
    document.getElementById('bottom').scrollIntoView({behavior: "smooth", block: "start"})
    
})