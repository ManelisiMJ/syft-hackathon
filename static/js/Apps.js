//Home menu button
const homeBtn1 = document.getElementById("home-1")
const homeBtn2 = document.getElementById("home-2")
homeBtn1.addEventListener("click", ()=>{
  window.location.href = `/`
})

homeBtn2.addEventListener("click", ()=>{
  window.location.href = `/`
})

//Add event listeners for all the buttons
const manageContactsBtn = document.getElementById('manage-contacts')
  manageContactsBtn.addEventListener('click', ()=> {
    window.location.href = `/manage-contacts`
})

const recordInvoiceBtn = document.getElementById('record-invoice')
  recordInvoiceBtn.addEventListener('click', ()=> {
    window.location.href = `/record-invoice`
})

const viewInvoicesBtn = document.getElementById('view-invoices')
  viewInvoicesBtn.addEventListener('click', ()=> {
    window.location.href = `/view-invoices`
})

const recordPaymentBtn = document.getElementById('record-payment')
  recordPaymentBtn.addEventListener('click', ()=> {
    window.location.href = `/record-payment`
})

const manageInventoryBtn = document.getElementById('manage-inventory')
  manageInventoryBtn.addEventListener('click', ()=> {
    window.location.href = `/manage-inventory`
})

const inventoryAnalyticsBtn = document.getElementById('inventory')
  inventoryAnalyticsBtn.addEventListener('click', ()=> {
    window.location.href = `/inventory-analytics`
})

const salesAndRevenueBtn = document.getElementById('sales-and-revenue')
  salesAndRevenueBtn.addEventListener('click', ()=> {
    window.location.href = `/sales-analytics`
})

const contactsAnalyticsBtn = document.getElementById('contacts')
  contactsAnalyticsBtn.addEventListener('click', ()=> {
    window.location.href = `/customer-analytics`
})


