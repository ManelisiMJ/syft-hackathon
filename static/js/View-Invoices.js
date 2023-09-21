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

const filterBtn = document.getElementById("filter")
const fetchBtn = document.getElementById("fetch")
const linesTable = document.getElementById("lines-table")
const searchID = document.getElementById("search-id")

function getQuery(){
    let query = "SELECT * from Invoice WHERE "  //Compile query
    let conditions = []
    const dueDate = document.getElementById("due-date").value
    const issueDate = document.getElementById("issue-date").value
    const invoiceID = document.getElementById("invoice-id").value
    const contactId = document.getElementById("contact-id").value
    const type = document.getElementById("type").value
    const paid = document.getElementById("paid").value
    
    // Check each input field and add it to the query if it's not empty
    if (dueDate !== '') 
        conditions.push(`due_date="${dueDate}"`)
    if (issueDate !== '')
        conditions.push(`issue_date="${issueDate}"`)
    if (invoiceID !== '') 
        conditions.push(`id="${invoiceID}"`)
    if (contactId !== '') 
        conditions.push(`contact="${contactId}"`)
    switch(type){
        case "sale":
            conditions.push(`is_sale=1`)
            break
        case "purchase":
            conditions.push(`is_sale=0`)
            break
    }
    switch (paid){
        case "true":
            conditions.push("paid=1")       //Convert true/false to 0/1
            break
        case "false":
            conditions.push("paid=0")
            break
    }
    return query += conditions.join(" AND ")
}

filterBtn.addEventListener("click", ()=>{
    let query = getQuery()
    if (query == "SELECT * from Invoice WHERE "){   //No conditions given
        window.alert("Please give filter criteria")
    }
    else{
        let url = `/view-invoices/query`    //Send query
        fetch(url, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(query)
        })
        .then(response => response.json())
        .then(data => {
            displayInvoices(data)   //Display invoices on table
        })
        .catch(error => console.log('Error:', error))
        }
})


fetchBtn.addEventListener("click", ()=>{
    let id = searchID.value
    if (id == ""){
        window.alert("Please enter a valid invoice id or click on invoice id cell in the table")
    }
    else{
        //Query to get invoice lines for the given invoice
        let query = `SELECT * from InvoiceLine WHERE invoice_id="${id}"`    
        let url = `/view-invoices/query-invoice-lines` //Send request
            fetch(url, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(query)
            })
            .then(response => response.json())
            .then(data => {
                if (data.length == 0)
                    window.alert("No records found with that invoice id")
                else
                    displayLineItems(data)
            })
            .catch(error => console.log('Error:', error))
        }
})

function displayInvoices(invoices){     //Displays the invoice on table
    const invoicesTable = document.getElementById("invoices-table")
    invoicesTable.innerHTML = ""
    for (let i = 0; i<invoices.length; i++){
        let sale = (invoices[i].is_sale == 1)
        let paid = (invoices[i].paid == 1)
        invoicesTable.innerHTML += `
                <td class="u-border-1 u-border-grey-30 u-table-cell invoice-id" style="cursor: pointer;">${invoices[i].id}</td>
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
    handleCellClick()   //Attach event listeners on the id cells
}

function displayLineItems(invoice){     //Displays the invoice line item on table
    linesTable.innerHTML = ""
    for (let i = 0; i<invoice.length; i++){
        linesTable.innerHTML += `
        <tr style="height: 50px">
                <td class="u-border-1 u-border-grey-30 u-table-cell">${invoice[i].id}</td>
                <td class="u-border-1 u-border-grey-30 u-table-cell">${invoice[i].invoice_id}</td>
                <td class="u-border-1 u-border-grey-30 u-table-cell">${invoice[i].description}</td>
                <td class="u-border-1 u-border-grey-30 u-table-cell">${invoice[i].item_code}</td>
                <td class="u-border-1 u-border-grey-30 u-table-cell">${invoice[i].total}</td>
                <td class="u-border-1 u-border-grey-30 u-table-cell">${invoice[i].quantity}</td>
        </tr>`
    }
}

function handleCellClick() {    //Attaches event lisener on every invoice id cell
    let invoiceCells = document.querySelectorAll(".invoice-id")
    for (let i = 0; i<invoiceCells.length; i++){
        invoiceCells[i].addEventListener("click",(event)=>{
            searchID.value = event.target.textContent   //Display id
        })
    }
}


