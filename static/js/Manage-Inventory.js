import SERVER_IP from './config.js'

const codeBox = document.getElementById("code")
const nameBox = document.getElementById("name")
const onHandBox = document.getElementById("on-hand")
const purchaseBox = document.getElementById("purchase-price")
const sellingBox = document.getElementById("selling-price")
const idBox = document.getElementById("id")
const updateBtn = document.getElementById("update")
const newBtn = document.getElementById("new")

let codeCells = document.querySelectorAll("code")
    for (let i = 0; i<codeCells.length; i++){
        codeCells[i].addEventListener("click",(event)=>{
            code.value = event.target.textContent
    })
}

const rows = document.querySelectorAll(".row")
console.log(rows)
for (let i = 0; i<rows.length; i++){
    rows[i].addEventListener("click", ()=>{
        const cellsInRow = rows[i].querySelectorAll("td");
        console.log(cellsInRow)
        // Iterate through the cells and assign their contents to variables
        cellsInRow.forEach(function (cell, index) {
        if (index === 0) 
            idBox.value = cell.textContent
        else if (index === 1) 
            nameBox.value = cell.textContent
        else if (index === 2) 
            codeBox.value = cell.textContent
        else if (index === 3)
            onHandBox.value = Number(cell.textContent)
        else if (index === 4) 
            purchaseBox.value = Number(cell.textContent)
        else
            sellingBox.value = Number(cell.textContent)
        })
      })
}

newBtn.addEventListener("click", ()=>{
    let newItem = createItem()
    if (isNaN(newItem.purchase_unit_price) || isNaN(newItem.sale_unit_price))
        window.alert("Please enter valid amounts for prices")
    else if (newItem.id!="" && newItem.name!="" && newItem.code!=""){
        let url = `${SERVER_IP}/manage-inventory/add`
            fetch(url, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(newItem)
            })
            .then(response => response.json())
            .then(data => {
                if (data == "success")
                    window.alert("Success, reload to view changes")
                else
                    window.alert("Error, ensure no duplicate codes")
            })
            .catch(error => console.log('Error:', error))
    }
    else
        window.alert("Please populate all fields")
})


updateBtn.addEventListener("click", ()=>{
    let updatedItem = createItem()
    if (isNaN(updatedItem.purchase_unit_price) || isNaN(updatedItem.sale_unit_price))
        window.alert("Please enter valid amounts for prices")
    else if (updatedItem.id!="" && updatedItem.name!="" && updatedItem.code!=""){
        let url = `${SERVER_IP}/manage-inventory/update`
            fetch(url, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedItem)
            })
            .then(response => response.json())
            .then(data => {
                if (data == "success")
                    window.alert("Success, reload to see changes")
                else
                    window.alert("Error, Ensure that you entered a valid code")
            })
            .catch(error => console.log('Error:', error))
    }
    else
        window.alert("Please populate all fields")
})

function createItem(){
    let id = idBox.value
    let itemName = nameBox.value
    let code = codeBox.value
    let onHand = Number(onHandBox.value)
    let purchasePrice = Number(purchaseBox.value)
    let sellingPrice = Number(sellingBox.value)
    let item = {
        id:id,
        name:itemName,
        code:code,
        quantity_on_hand:onHand,
        purchase_unit_price:purchasePrice,
        sale_unit_price:sellingPrice
    }
    return item
}
