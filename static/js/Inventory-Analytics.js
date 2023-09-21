let url1 = `/inventory-analytics/profit-margins` 
    fetch(url1, {
    method: 'GET', 
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
        
        new Chart("profit-margins", {
            type: 'bar',
            data: values,
            options: options
        })
      })
    .catch(error => {
        console.log('There was a problem with the fetch operation:', error)
    })


let url2 = `/inventory-analytics/top-items` 
    fetch(url2, {
    method: 'GET', 
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
        
        new Chart("top-selling-items", {
            type: 'horizontalBar',
            data: values,
            options: options
        })
      })
    .catch(error => {
        console.log('There was a problem with the fetch operation:', error)
    })


    let url3 = `/inventory-analytics/stock-levels` 
    fetch(url3, {
    method: 'GET', 
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
        
        new Chart("stock-levels", {
            type: 'bar',
            data: values,
            options: options
        })
      })
    .catch(error => {
        console.log('There was a problem with the fetch operation:', error)
    })