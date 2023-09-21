let url = `/customer-analytics/customer-composition` 
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
        new Chart("contact-composition",{
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
                text: "Contacts Composition"
              }
            }
        })
      })
    .catch(error => {
        console.log('There was a problem with the fetch operation:', error)
    })


let url2 = `/customer-analytics/payment-trends` 
    fetch(url2, {
    method: 'GET', 
    })
    .then(response => response.json())
    .then(data => {
        new Chart("payment-trends", {
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

let table = document.getElementById("outstanding-invoices")
let url3 = `/customer-analytics/outstanding-invoices` 
    fetch(url3, {
    method: 'GET', 
    })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      displayOutstandingInvoices(data)
    })  
    .catch(error => {
        console.log('There was a problem with the fetch operation:', error)
    })


function displayOutstandingInvoices(data){  
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


