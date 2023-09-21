let url = `/sales-analytics/total-revenue` 
    fetch(url, {
    method: 'GET', 
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        new Chart("revenue-over-time", data)
      })
    .catch(error => {
        console.log('There was a problem with the fetch operation:', error)
    })

let url2 = `/sales-analytics/revenue-by-customer` 
    fetch(url2, {
    method: 'GET', 
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
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
                        var index = tooltipItem.index;
                        var purchaseCount = zArray[index]; 
                        return 'Total Spending: $' + tooltipItem.yLabel + ' | Purchases: ' + purchaseCount;
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
        
        new Chart("sales-by-customer", {
            type: 'bar',
            data: values,
            options: options
        })
      })
    .catch(error => {
        console.log('There was a problem with the fetch operation:', error)
    })