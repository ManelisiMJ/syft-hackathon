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

let profitMarginsChart = null
let topSellingItemsChart = null
let stockLevelsChart = null

let topSellingBtn = document.getElementById("apply-top-selling")
let profitMarginsBtn = document.getElementById("apply-margins")
let stockLevelsBtn = document.getElementById("apply-levels")

topSellingBtn.addEventListener("click", ()=>{
    let lowerBound = document.getElementById("greater-than").value
    let upperBound = document.getElementById("less-than").value
    let condition
    if (lowerBound != "" && upperBound != "" && !isNaN(lowerBound) && !isNaN(upperBound)){
        condition = `> ${Number(lowerBound)} and total_sold < ${Number(upperBound)}`
    }
    else if (lowerBound != "" && !isNaN(lowerBound)){
        condition = `> ${Number(lowerBound)}`
    }
    else if (upperBound != "" && !isNaN(upperBound)){
        condition = `< ${upperBound}`
    }
    else
        condition = ""
    topSellingItems(condition)
})

profitMarginsBtn.addEventListener("click", ()=>{
    let lowerBound = document.getElementById("greater-than3").value
    let upperBound = document.getElementById("less-than3").value
    let condition
    if (lowerBound != "" && upperBound != "" && !isNaN(lowerBound) && !isNaN(upperBound)){
        condition = `> ${Number(lowerBound)} and profit_margin < ${Number(upperBound)}`
    }
    else if (lowerBound != "" && !isNaN(lowerBound)){
        condition = `> ${Number(lowerBound)}`
    }
    else if (upperBound != "" && !isNaN(upperBound)){
        condition = `< ${upperBound}`
    }
    else
        condition = ""
    profitMargins(condition)
})

stockLevelsBtn.addEventListener("click", ()=>{
    let lowerBound = document.getElementById("greater-than2").value
    let upperBound = document.getElementById("less-than2").value
    let condition
    if (lowerBound != "" && upperBound != "" && !isNaN(lowerBound) && !isNaN(upperBound)){
        condition = `> ${Number(lowerBound)} and quantity_on_hand < ${Number(upperBound)}`
    }
    else if (lowerBound != "" && !isNaN(lowerBound)){
        condition = `> ${Number(lowerBound)}`
    }
    else if (upperBound != "" && !isNaN(upperBound)){
        condition = `< ${upperBound}`
    }
    else
        condition = ""
    stockLevels(condition)
})

function profitMargins(condition){
    if (profitMarginsChart != null)           
        profitMarginsChart.destroy()              //Destroy previous chart

    let url1 = `/inventory-analytics/profit-margins`        //Request to get profit margins
        fetch(url1, {
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
                            let itemCode = zArray[index]; 
                            return 'Profit Margin: ' + tooltipItem.yLabel + ' | Item Code: ' + itemCode;
                        }
                    }
                },
                legend: {display: false},
                title: {
                    display: true,
                    text: 'Profit Margins',
                    fontSize: 20, 
                },
                scales: {
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Item Name', 
                            fontSize: 16 
                        }
                    }],
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Profit Margin', 
                            fontSize: 16 
                        }
                    }]
                }
            }
            
            profitMarginsChart = new Chart("profit-margins", {           //Display chart
                type: 'bar',
                data: values,
                options: options
            })
        })
        .catch(error => {
            console.log('There was a problem with the fetch operation:', error)
        })
    }


function topSellingItems(condition){
    if (topSellingItemsChart != null)           
        topSellingItemsChart.destroy()              //Destroy previous chart

    let url2 = `/inventory-analytics/top-items`         //Request to get top selling items
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
                        backgroundColor: "rgba(0,0,255,1.0)",
                        borderColor: "rgba(0,0,255,0.1)"
                    }
                ]
            }
            let options = {
                tooltips: {
                    callbacks: {
                        label: function (tooltipItem, data) {
                            var index = tooltipItem.index;
                            var itemCode = zArray[index]; 
                            return 'Quantity Sold: ' + tooltipItem.xLabel + ' | Item Code: ' + itemCode;
                        }
                    }
                },
                legend: {display: false},
                title: {
                    display: true,
                    text: 'Top Selling Items',
                    fontSize: 20, 
                },
                scales: {
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Quantity Sold', 
                            fontSize: 16 
                        }
                    }],
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Item', 
                            fontSize: 16 
                        }
                    }]
                }
            }
            
            topSellingItemsChart = new Chart("top-selling-items", {        //Display chart
                type: 'horizontalBar',
                data: values,
                options: options
            })
        })
        .catch(error => {
            console.log('There was a problem with the fetch operation:', error)
        })
    }

function stockLevels(condition){
    if (stockLevelsChart != null)           
        stockLevelsChart.destroy()              //Destroy previous chart
    let url3 = `/inventory-analytics/stock-levels`          //Request to get sock levels
    fetch(url3, {
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
                    backgroundColor: 'rgba(250, 42, 42, 0.792)', 
                    borderColor: 'rgba(250, 42, 42, 0.1)', 
                }
            ]
        }
        let options = {
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        let index = tooltipItem.index;
                        let itemCode = zArray[index]; 
                        return 'Stock Level: ' + tooltipItem.yLabel + ' | Item Code: ' + itemCode;
                    }
                }
            },
            legend: {display: false},
            title: {
                display: true,
                text: 'Stock Levels',
                fontSize: 20, 
            },
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Item Name', 
                        fontSize: 16 
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Stock Level', 
                        fontSize: 16 
                    }
                }]
            }
        }
        
        stockLevelsChart = new Chart("stock-levels", {             //Display chart
            type: 'bar',
            data: values,
            options: options
        })
      })
    .catch(error => {
        console.log('There was a problem with the fetch operation:', error)
    })
}

topSellingItems("")
stockLevels("")
profitMargins("")