//Home and Apps menu button
const homeBtn1 = document.getElementById("home-1")
const homeBtn2 = document.getElementById("home-2")
const appsBtn1 = document.getElementById("apps-1")
const appsBtn2 = document.getElementById("apps-2")
homeBtn1.addEventListener("click", ()=>{
  window.location.href = `/`
})

homeBtn2.addEventListener("click", ()=>{
  window.location.href = `/`
})

appsBtn1.addEventListener("click", ()=>{
    window.location.href = `/apps`
})
  
appsBtn2.addEventListener("click", ()=>{
window.location.href = `/apps`
})

const lineInvoiceId = document.getElementById("invoice-id")
const addBtn = document.getElementById("add-line")
const createBtn = document.getElementById("create")

createBtn.addEventListener("click", ()=>{
    let invoiceID = document.getElementById("new-invoice-id").value
    let issueDate = document.getElementById("issue-date").value
    let dueDate = document.getElementById("due-date").value
    let contactID = document.getElementById("contact").value
    let exchangeRate = Number(document.getElementById("exchange-rate").value)
    let currency = document.getElementById("currency").value
    let type = document.getElementById("type").value

    if (isNaN(exchangeRate) || exchangeRate==0){
        window.alert("Ensure that exchange rate is a non-zero real number")
    }
    else{
        if (invoiceID!="" && issueDate!="" && dueDate!="" && contactID!=""){
            let newInvoice = {      //Create object from the inputs
                id:invoiceID,
                issue_date:issueDate,
                due_date:dueDate,
                contact_id:contactID,
                exchange_rate:exchangeRate,
                currency:currency,
                paid:0,
                total:0,
                amount_due:0
            }
            newInvoice.is_sale = (type == "Sale")? 1: 0 //Convert to 0/1

            let url = `/record-invoice/new-invoice` //Send request
            fetch(url, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(newInvoice)
            })
            .then(response => response.json())
            .then(data => {
                if (data == "success"){
                    window.alert("Invoice recorded, Add line item to it")
                    lineInvoiceId.value = invoiceID    
                }
                else 
                    window.alert("Error, Please ensure a unique invoice id and a valid contact id")
            })
            .catch(error => console.log('Error:', error))
        }
        else
            window.alert("Please ensure all fields are populated")
    }
})


addBtn.addEventListener("click", ()=>{      //Adds a line item to an invoice
    const table = document.getElementById("lines-table")
    const item = document.getElementById("item-code").value
    const lineId = document.getElementById("line-id").value
    const description = document.getElementById("description").value
    const total = Number(document.getElementById("total").value)
    const quantity = Number(document.getElementById("quantity").value)

    if (isNaN(total) || total<=0){
        window.alert("Ensure total is a positive real number")
    }
    else{
        if (lineInvoiceId.value!="" && lineId != "" && description!=""){
            let newInvoiceLine = {  //Create new invoice line item
                id:lineId,
                invoice_id:lineInvoiceId.value,
                description:description,
                item_code:item,
                total:total,
                quantity:quantity
            }
            
            let url = `/record-invoice/new-invoice-line`    //Send request
            fetch(url, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(newInvoiceLine)
            })
            .then(response => response.json())
            .then(data => {
                if (data == "success"){
                    //Display new line item
                    window.alert("Invoice Line added, Corresponding records updated successfully!")
                    table.innerHTML += `<tr style="height: 50px;">     
                    <td class="u-border-1 u-border-grey-30 u-table-cell">${newInvoiceLine.id}</td>
                    <td class="u-border-1 u-border-grey-30 u-table-cell">${newInvoiceLine.invoice_id}</td>
                    <td class="u-border-1 u-border-grey-30 u-table-cell">${newInvoiceLine.item_code}</td>
                    <td class="u-border-1 u-border-grey-30 u-table-cell">${newInvoiceLine.description}</td>
                    <td class="u-border-1 u-border-grey-30 u-table-cell">${newInvoiceLine.total}</td>
                    <td class="u-border-1 u-border-grey-30 u-table-cell">${newInvoiceLine.quantity}</td>
                  </tr>`
                }
                else 
                    window.alert("Error, Please ensure a valid invoice id and a unique invoice line id")
            })
            .catch(error => console.log('Error:', error))
        }
        else
            window.alert("Ensure all fields are populated")
    }

})




