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

const salesOverTimeBtn = document.getElementById("apply-sales")
const customerSalesBtn = document.getElementById("apply-customer")
let salesByCustomerChart = null
let revenueOverTimeChart = null

salesOverTimeBtn.addEventListener("click", ()=>{
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
    totalRevenueOverTime(condition)
})

customerSalesBtn.addEventListener("click", ()=>{
    let lowerBound = document.getElementById("greater-than").value
    let upperBound = document.getElementById("less-than").value
    let condition
    if (lowerBound != "" && upperBound != "" && !isNaN(lowerBound) && !isNaN(upperBound)){
        condition = `> ${Number(lowerBound)} and total_purchases < ${Number(upperBound)}`
    }
    else if (lowerBound != "" && !isNaN(lowerBound)){
        condition = `> ${Number(lowerBound)}`
    }
    else if (upperBound != "" && !isNaN(upperBound)){
        condition = `< ${upperBound}`
    }
    else
        condition = ""
    salesByCustomer(condition)
})

function totalRevenueOverTime(condition){
    if (revenueOverTimeChart != null)           
        revenueOverTimeChart.destroy()              //Destroy previous chart
    let url = `/sales-analytics/total-revenue`      //Send request to get total revenue data
        fetch(url, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(condition)
        })
        .then(response => response.json())
        .then(data => {
            revenueOverTimeChart = new Chart("revenue-over-time", {        //Create line chart to visualize
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
                        text: "Total Sales over Time",
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
                                labelString: 'Sales Amount', 
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

function salesByCustomer(condition){
    if (salesByCustomerChart != null)
        salesByCustomerChart.destroy()
    let url2 = `/sales-analytics/revenue-by-customer`       //Send request to get data about revenue from customers
        fetch(url2, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(condition)
        })
        .then(response => response.json())
        .then(data => {
            let xArray = data[0]
            let yArray = data[1]
            let zArray = data[2]

            let values = {
                labels: xArray,
                datasets: [
                    {
                        data: yArray,
                        backgroundColor: 'rgb(242, 245, 17)', 
                        borderColor: 'rgba(75, 192, 192, 1)', 
                    }
                ]
            }
            let options = {
                tooltips: {
                    callbacks: {
                        label: function (tooltipItem, data) {
                            let index = tooltipItem.index;
                            let purchaseCount = zArray[index]; 
                            return 'Total Spending: R' + tooltipItem.yLabel + ' | Purchases: ' + purchaseCount;
                        }
                    }
                },
                legend: {display: false},
                title: {
                    display: true,
                    text: 'Sales by Customer',
                    fontSize: 20, 
                },
                scales: {
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Customer', 
                            fontSize: 16 
                        }
                    }],
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Sales Amount', 
                            fontSize: 16 
                        }
                    }]
                }
            }
            
            salesByCustomerChart = new Chart("sales-by-customer", {        //Create chart to visualize data
                type: 'bar',
                data: values,
                options: options
            })
        })
        .catch(error => {
            console.log('There was a problem with the fetch operation:', error)
        })
    }

    salesByCustomer("")
    totalRevenueOverTime("")