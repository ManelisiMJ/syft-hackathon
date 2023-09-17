import SERVER_IP from './config.js'

const invoiceIdBox = document.getElementById("invoice-id")
const amountBox = document.getElementById("amount")
const recordBtn = document.getElementById("record")
const loadBtn = document.getElementById("load")
const paymentIdBox = document.getElementById("payment-id")
const dateBox = document.getElementById("date")
const contactIdBox = document.getElementById("contact-id")
const exchangeRateBox = document.getElementById("exchange-rate")

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
    if (isNaN(amount) || amount <= 0)
        window.alert("Please enter a valid amount")
    else{
        let payment = {invoice_id:invoiceIdBox.value, amount:amount}
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
        })
        .catch(error => console.log('Error:', error))
    }
})

function displayInvoices(invoices){
    const invoiceTable = document.getElementById("invoice-table")
    invoiceTable.innerHTML = ""
    for (let i = 0; i<invoices.length; i++){
        let sale = (invoices[i].is_sale == 1)
        let paid = (invoices[i].paid == 1)
        invoiceTable.innerHTML += `
                <td class="u-border-1 u-border-grey-30 u-table-cell">${invoices[i].id}</td>
                <td class="u-border-1 u-border-grey-30 u-table-cell">${invoices[i].issue_date}</td>
                <td class="u-border-1 u-border-grey-30 u-table-cell">${invoices[i].due_date}</td>
                <td class="u-border-1 u-border-grey-30 u-table-cell">${paid}</td>
                <td class="u-border-1 u-border-grey-30 u-table-cell">${invoices[i].contact_id}</td>
                <td class="u-border-1 u-border-grey-30 u-table-cell">${invoices[i].total}</td>
                <td class="u-border-1 u-border-grey-30 u-table-cell">${invoices[i].amount_due}</td>
                <td class="u-border-1 u-border-grey-30 u-table-cell">${invoices[i].exchange_rate}</td>
                <td class="u-border-1 u-border-grey-30 u-table-cell">${invoices[i].currency}</td>
                <td class="u-border-1 u-border-grey-30 u-table-cell">${sale}</td>`
    }
}