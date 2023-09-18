import SERVER_IP from './config.js'

const invoiceIdBox = document.getElementById("invoice-id")
const amountBox = document.getElementById("amount")
const recordBtn = document.getElementById("record")
const loadBtn = document.getElementById("load")
const paymentIdBox = document.getElementById("payment-id")
const dateBox = document.getElementById("date")
const contactIdBox = document.getElementById("contact-id")
const exchangeRateBox = document.getElementById("exchange-rate")
let sale

loadBtn.addEventListener("click", ()=>{
    let invoiceId = invoiceIdBox.value
    let query = `Select * from Invoice WHERE id="${invoiceId}"`
    let url = `${SERVER_IP}/record-payment/query`
        fetch(url, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(query)
        })
        .then(response => response.json())
        .then(data => {
            displayInvoices(data)
        })
        .catch(error => console.log('Error:', error))
})

recordBtn.addEventListener("click", ()=>{
    let amount = Number(amountBox.value)
    let paymentId = paymentIdBox.value
    let date = dateBox.value
    let contactId = contactIdBox.value
    let exchangeRate = Number(exchangeRateBox.value)
    if (isNaN(amount) || amount <= 0 || isNaN(exchangeRate) || exchangeRate<=0)
        window.alert("Please enter valid payment amount and exchange rate")
    else if (paymentId != "" && date != "" && contactId != ""){
        let payment = {
            id:paymentId,
            amount:amount,
            date: date,
            contact_id:contactId,
            total:amount,
            exchange_rate:exchangeRate,
            invoice_id:invoiceIdBox.value
        }
        let url = `${SERVER_IP}/record-payment/pay`
        fetch(url, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(payment)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if (data == "success"){
                displayPayment(payment)
                window.alert("Payment posted and allocated successfully!")
            }
            else{
                window.alert("An error occured, operation abored. Ensure valid invoice id and contact id")
            }
        })
        .catch(error => console.log('Error:', error))
    }
    else
        window.alert("Ensure all fields are populated")
})

function displayInvoices(invoices){
    const invoiceTable = document.getElementById("invoice-table")
    invoiceTable.innerHTML = ""
    for (let i = 0; i<invoices.length; i++){
        sale = (invoices[i].is_sale == 1)
        let paid = (invoices[i].paid == 1)
        invoiceTable.innerHTML += `
            <tr style="height: 38px;" class="row">
                <td class="u-border-1 u-border-grey-30 u-table-cell">${invoices[i].id}</td>
                <td class="u-border-1 u-border-grey-30 u-table-cell">${invoices[i].issue_date}</td>
                <td class="u-border-1 u-border-grey-30 u-table-cell">${invoices[i].due_date}</td>
                <td id="paid" class="u-border-1 u-border-grey-30 u-table-cell">${paid}</td>
                <td class="u-border-1 u-border-grey-30 u-table-cell">${invoices[i].contact_id}</td>
                <td class="u-border-1 u-border-grey-30 u-table-cell">${invoices[i].total}</td>
                <td id="amount-due" class="u-border-1 u-border-grey-30 u-table-cell">${invoices[i].amount_due}</td>
                <td class="u-border-1 u-border-grey-30 u-table-cell">${invoices[i].exchange_rate}</td>
                <td class="u-border-1 u-border-grey-30 u-table-cell">${invoices[i].currency}</td>
                <td class="u-border-1 u-border-grey-30 u-table-cell">${sale}</td>
            </tr>`
    }
    handleCellClick()
}

function displayPayment(payment){
    const paymentTable = document.getElementById("payment-table")
    paymentTable.innerHTML += `
    <tr style="height: 44px;">
        <td class="u-border-1 u-border-grey-30 u-table-cell">${payment.id}</td>
        <td class="u-border-1 u-border-grey-30 u-table-cell">${payment.date}</td>
        <td class="u-border-1 u-border-grey-30 u-table-cell">${payment.contact_id}</td>
        <td class="u-border-1 u-border-grey-30 u-table-cell">${payment.total}</td>
        <td class="u-border-1 u-border-grey-30 u-table-cell">${payment.exchange_rate}</td>
        <td class="u-border-1 u-border-grey-30 u-table-cell">${sale}</td>
    </tr>`
    const amountDueCell = document.getElementById("amount-due")
    const paidCell = document.getElementById("paid")
    let newAmountDue = Number(amountDueCell.textContent) - payment.total
    amountDueCell.textContent = newAmountDue
    
    if (newAmountDue <= 0)
        paidCell.textContent = "true"
    else
        paidCell.textContent = "false"
}

function handleCellClick(){
    const rows = document.querySelectorAll(".row")
    for (let i = 0; i<rows.length; i++){
        rows[i].addEventListener("click", ()=> {
            const cellsInRow = rows[i].querySelectorAll("td");
            // Iterate through the cells and assign their contents to variables
            cellsInRow.forEach(function (cell, index) {
            if (index === 4) 
                contactIdBox.value = cell.textContent
            else if (index === 7)
                exchangeRateBox.value = Number(cell.textContent)
            })
        })
    }
}