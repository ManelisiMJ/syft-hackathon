import SERVER_IP from './config.js'

const contactsTable = document.getElementById("contacts-table")
const showAllBtn = document.getElementById('show-all')
  showAllBtn.addEventListener('click', ()=> {
    let url = `${SERVER_IP}/manage-contacts/query-all`
    fetch(url, {
    method: 'GET', 
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        displayContacts(data)
      })
    .catch(error => {
        console.log('There was a problem with the fetch operation:', error)
    })
})

function getQuery(){
    let query = "SELECT * from Contact WHERE "
    let conditions = []
    // Get references to your input elements by their IDs
    const nameInput = document.getElementById('name')
    const emailInput = document.getElementById('email')
    const roleInput = document.getElementById('role')
    const phoneInput = document.getElementById('phone')
    const idInput = document.getElementById('id')
  
    // Check each input field and add it to the query if it's not empty
    if (nameInput.value.trim() !== '') 
        conditions.push(`name="${nameInput.value.trim()}"`)
    if (emailInput.value.trim() !== '')
        conditions.push(`email="${emailInput.value.trim()}"`)
    if (phoneInput.value.trim() !== '') 
        conditions.push(`phone="${nameInput.value.trim()}"`)
    if (idInput.value.trim() !== '') 
        conditions.push(`id="${nameInput.value.trim()}"`)
    //Get the contact's role
    switch (roleInput.value){
        case "Customer":
            conditions.push("is_customer=1")
            break
        case "Supplier":
            conditions.push("is_supplier=1")
            break
        case "Both":
            conditions.push("is_customer=1")
            conditions.push("is_supplier=1")
            break
        case "None":
            conditions.push("is_customer=0")
            conditions.push("is_supplier=0")
            break
    }
    return query += conditions.join(" AND ")
}

const filterBtn = document.getElementById('apply-filter')
  filterBtn.addEventListener('click', ()=> {
    let query = getQuery()
    if (query == "SELECT * from Contact WHERE "){
        window.alert("Please give filter criteria")
    }
    else{
        let url = `${SERVER_IP}/manage-contacts/query`
        fetch(url, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(query)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            displayContacts(data)
        })
        .catch(error => console.log('Error:', error))
        }
})


function displayContacts(contacts){
    contactsTable.innerHTML = ""
    for (let i = 0; i<contacts.length; i++){
        let customer = (contacts[i].is_customer == 1)
        let supplier = (contacts[i].is_supplier == 1)
        contactsTable.innerHTML += `
        <tr style="height: 50px">
                <td class="u-border-1 u-border-grey-30 u-table-cell">${contacts[i].id}</td>
                <td class="u-border-1 u-border-grey-30 u-table-cell">${contacts[i].name}</td>
                <td class="u-border-1 u-border-grey-30 u-table-cell">${contacts[i].email}</td>
                <td class="u-border-1 u-border-grey-30 u-table-cell">${contacts[i].phone}</td>
                <td class="u-border-1 u-border-grey-30 u-table-cell">${customer}</td>
                <td class="u-border-1 u-border-grey-30 u-table-cell">${supplier}</td>
        </tr>`
    }
}

const newCustomerBtn = document.getElementById("new")
newCustomerBtn.addEventListener("click", ()=>{
    const name = document.getElementById('new-name').value.trim()
    const email = document.getElementById('new-email').value.trim()
    const phone = document.getElementById('new-phone').value.trim()
    const id = document.getElementById('new-id').value.trim()
    const is_supplier = document.getElementById('new-is-supplier').value
    const is_customer = document.getElementById('new-is-customer').value

    let newUser = {}

    if (id == ""){
        window.alert("Please enter a unique contact_id")
    }
    else{
        if (!name == "")
            newUser.name = name
        if (!email == "")
            newUser.email = email
        if (!phone == "")
            newUser.phone = phone
        newUser.id = id
        newUser.is_supplier = (is_supplier == "True")? 1: 0
        newUser.is_customer = (is_customer == "True")? 1: 0

        console.log(newUser)

        let url = `${SERVER_IP}/manage-contacts/new-contact`
        fetch(url, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        })
        .then(response => response.json())
        .then(data => {
            if (data == "success")
                window.alert("New contact added successfully!")
            else 
            window.alert("Error, Ensure no duplicates in contact_id")
        })
        .catch(error => console.log('Error:', error))
        }
    }
)


const updateCustomerBtn = document.getElementById("update")
updateCustomerBtn.addEventListener("click", ()=>{
    const name = document.getElementById('new-name').value.trim()
    const email = document.getElementById('new-email').value.trim()
    const phone = document.getElementById('new-phone').value.trim()
    const id = document.getElementById('new-id').value.trim()
    const is_supplier = document.getElementById('new-is-supplier').value
    const is_customer = document.getElementById('new-is-customer').value

    if (id == ""){
        window.alert("Please enter a valid contact id")
    }
    else{
        let updatedUser = {}
        if (!name == "")
            updatedUser.name = name
        if (!email == "")
            updatedUser.email = email
        if (!phone == "")
            updatedUser.phone = phone
        updatedUser.id = id
        updatedUser.is_supplier = is_supplier
        updatedUser.is_customer = is_customer

        console.log(updatedUser)

        let url = `${SERVER_IP}/manage-contacts/update-contact`
        fetch(url, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedUser)
        })
        .then(response => response.json())
        .then(data => {
            if (data == "success")
                window.alert("Contact updated successfully!")
            else 
                window.alert("Could not update contact, Ensure contact id is correct")
        })
        .catch(error => console.log('Error:', error))
        }
})

