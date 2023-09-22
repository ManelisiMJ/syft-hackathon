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

let paymentsOverTimeBtn = document.getElementById("apply-payments")

paymentsOverTimeBtn.addEventListener("click", ()=>{
  let from = document.getElementById("from-date").value
  let to = document.getElementById("to-date").value
  let condition
  if (from != "" && to != ""){
      condition = `BETWEEN '${from}' AND '${to}'`
  }
  else if (from != ""){
      condition = `> '${from}'`
  }
  else if (to != ""){
      condition = `< '${to}'`
  }
  else
      condition = ""
  paymentsOverTime(condition)
})

let outstandingInvoicesBtn = document.getElementById("apply-outstanding")
outstandingInvoicesBtn.addEventListener("click", ()=>{
    let lowerBound = document.getElementById("greater-than").value
    let upperBound = document.getElementById("less-than").value
    let condition
    if (lowerBound != "" && upperBound != "" && !isNaN(lowerBound) && !isNaN(upperBound)){
        condition = `> ${Number(lowerBound)} and outstanding_amount < ${Number(upperBound)}`
    }
    else if (lowerBound != "" && !isNaN(lowerBound)){
        condition = `> ${Number(lowerBound)}`
    }
    else if (upperBound != "" && !isNaN(upperBound)){
        condition = `< ${upperBound}`
    }
    else
        condition = ""
    outstandingInvoices(condition)
})

let url = `/customer-analytics/customer-composition`    //Send request to get contact composition data
    fetch(url, {
    method: 'GET', 
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        let barColors = [
            "rgba(0,0,255,1.0)",
            "#00aba9",
            "#2b5797",
            "rgb(242, 245, 17)",
            "#1e7145"
          ]
        new Chart("contact-composition",{       //Create chart to visualize data
            type: "doughnut",
            data: {
              labels: ["Customers", "Suppliers", "Both", "Neither"],
              datasets: [{
                backgroundColor: barColors,
                data: data
              }]
            },
            options: {
              title: {
                display: true,
                text: "Contacts Composition",
                fontSize: 20
              }
            }
        })
      })
    .catch(error => {
        console.log('There was a problem with the fetch operation:', error)
    })


function paymentsOverTime(condition){
  let url2 = `/customer-analytics/payment-trends`   //Send request to get customers' payment trends
      fetch(url2, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(condition)
      })
      .then(response => response.json())
      .then(data => {
          new Chart("payment-trends", {     //Create chart to visualize data
              type: "line",
              data: {
                  labels: data[0],
                  datasets: [{
                  fill: false,
                  lineTension: 0,
                  backgroundColor: "rgba(0,0,255,1.0)",
                  borderColor: "rgba(0,0,255,0.1)",
                  data: data[1]
                  }]
              },
              options: {
                  legend: {display: false},
                  title: {
                      display: true,
                      text: "Customer Payment Trends over Time",
                      fontSize: 20
                  },
                  scales: {
                      xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: 'Months', 
                          fontSize: 16 
                      }
                      }],
                      yAxes: [{
                          scaleLabel: {
                              display: true,
                              labelString: 'Payment Amount', 
                              fontSize: 16 
                          }
                      }]
                  }
              }
          })
        })
      .catch(error => {
          console.log('There was a problem with the fetch operation:', error)
      })
  }


function outstandingInvoices(condition){
  let url3 = `/customer-analytics/outstanding-invoices`       //Fetch data
      fetch(url3, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(condition)
      })
      .then(response => response.json())
      .then(data => {
        displayOutstandingInvoices(data)    //Display in table
      })  
      .catch(error => {
          console.log('There was a problem with the fetch operation:', error)
      })
  }


function displayOutstandingInvoices(data){      //Displays the data in a table
  let table = document.getElementById("outstanding-invoices")     //Table to display outstanding invoices
  table.innerHTML = ""
  for (let i = 0; i<(data[0]).length; i++){
      table.innerHTML += `
      <tr style="height: 50px">
              <td class="u-border-1 u-border-grey-30 u-table-cell">${data[0][i]}</td>
              <td class="u-border-1 u-border-grey-30 u-table-cell">${data[1][i]}</td>
              <td class="u-border-1 u-border-grey-30 u-table-cell">${data[2][i]}</td>
      </tr>`
  }
}

paymentsOverTime("")
outstandingInvoices("")

