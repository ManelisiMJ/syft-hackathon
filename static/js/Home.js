import SERVER_IP from './config.js'

const appsBtn = document.getElementById('apps')
    appsBtn.addEventListener('click', () => {
    window.location.href = `${SERVER_IP}/apps`
});










// chainBtn.addEventListener("click", ()=>{
//     window.location.href = `${SERVER_IP}/chain`
// })