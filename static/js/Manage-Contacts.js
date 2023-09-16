import SERVER_IP from './config.js'

const showAllBtn = document.getElementById('show-all')
  showAllBtn.addEventListener('click', ()=> {
    let url = `${SERVER_IP}/manage-contacts/query`
    fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"message":"hello world"})
      })
      .then(response => response.json())
      .then(data => {
        console.log(data)
      })
      .catch(error => console.error('Error:', error));
});

const filterBtn = document.getElementById('apply-filter')
  filterBtn.addEventListener('click', ()=> {
    let url = `${SERVER_IP}/manage-contacts/query`
    fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"message":"hello world"})
      })
      .then(response => response.json())
      .then(data => {
        console.log(data)
      })
      .catch(error => console.error('Error:', error));
});