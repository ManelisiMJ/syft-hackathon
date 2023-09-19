import SERVER_IP from './config.js'

//Add event listeners for all the buttons
const manageContactsBtn = document.getElementById('manage-contacts')
  manageContactsBtn.addEventListener('click', ()=> {
    window.location.href = `${SERVER_IP}/manage-contacts`
});

const recordInvoiceBtn = document.getElementById('record-invoice')
  recordInvoiceBtn.addEventListener('click', ()=> {
    window.location.href = `${SERVER_IP}/record-invoice`
});

const viewInvoicesBtn = document.getElementById('view-invoices')
  viewInvoicesBtn.addEventListener('click', ()=> {
    window.location.href = `${SERVER_IP}/view-invoices`
});

const recordPaymentBtn = document.getElementById('record-payment')
  recordPaymentBtn.addEventListener('click', ()=> {
    window.location.href = `${SERVER_IP}/record-payment`
});

const manageInventoryBtn = document.getElementById('manage-inventory')
  manageInventoryBtn.addEventListener('click', ()=> {
    window.location.href = `${SERVER_IP}/manage-inventory`
});
