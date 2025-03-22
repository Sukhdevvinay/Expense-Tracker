document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('myChart').getContext('2d');

    new Chart(ctx, {
        type: 'bar', // Change this to the chart type you want (e.g., 'line', 'pie', etc.)
        data: chartData,
        options: {
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                },
            }
        }
    });
});
document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('expenseChart').getContext('2d');

    // Extract labels and amounts from the expenses data
    const labels = expenses.map(function (val) {
        // console.log("C : ",val);
        return val.Expense_category;
    });
    const data = expenses.map(function (val) {
        return val.Amount;
    });

    // Create the pie chart
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Expenses',
                data: data,
                backgroundColor: [
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 206, 100, 0.2)',
                    'rgba(201, 203, 207, 0.2)',
                    'rgba(255, 99, 71, 0.2)',
                    'rgba(100, 149, 237, 0.2)',
                    'rgba(60, 179, 113, 0.2)',
                    'rgba(238, 130, 238, 0.2)',
                    'rgba(255, 165, 0, 0.2)',
                    'rgba(0, 206, 209, 0.2)',
                    'rgba(72, 61, 139, 0.2)',
                    'rgba(220, 20, 60, 0.2)'

                ],
                borderColor: [
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 206, 100, 1)',
                    'rgba(201, 203, 207, 1)',
                    'rgba(255, 99, 71, 1)',
                    'rgba(100, 149, 237, 1)',
                    'rgba(60, 179, 113, 1)',
                    'rgba(238, 130, 238, 1)',
                    'rgba(255, 165, 0, 1)',
                    'rgba(0, 206, 209, 1)',
                    'rgba(72, 61, 139, 1)',
                    'rgba(220, 20, 60, 1)'

                ],
                borderWidth: 1,
                radius:150,
                hoverOffset:20
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Expense Distribution',
                    color:'#14fbff'
                }
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('myFullWidthChart').getContext('2d');
    const d = expenses.map(function(val) {
    })
    // Define the labels for the x-axis
    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July','August','September','October','Novemeber','December'];

    // Sample data arrays (replace these with actual data)
    // const dataSets =expenses.map(function (val) {
    //     console.log("Arr : ",val.Monthly_exp);
    //     return val.Monthly_exp;
    // });
    // Colors for each dataset
    const colors = [
        'rgba(75, 192, 192, 1)', // Color for Dataset 1
        'rgba(255, 99, 132, 1)', // Color for Dataset 2
        'rgba(54, 162, 235, 1)',  // Color for Dataset 3
        'rgba(74, 65, 235, 1)',
        'rgba(94, 240, 35, 1)',
        'rgba(250, 131, 85, 1)',
        'rgba(210, 150, 96, 1)',
        'rgba(140, 140, 144, 1)',
        'rgba(145, 121, 196, 1)',
        'rgba(65, 212, 200, 1)',
    ];

    const datasets = expenses.map((val,index) => ({ 
        label: `${val.Expense_category}`,
        data: val.Monthly_exp,
        fill: false,
        borderColor: colors[index++],
        tension: 0.1
    }));

    // Configure the chart
    const chartData = {
        labels: labels,
        datasets: datasets
    };

    // Create the line chart
    new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            maintainAspectRatio: false, // Allow the chart to fill the container
            responsive: true, // Make the chart responsive to screen size
            scales: {
                y: {
                    beginAtZero: true, // Start y-axis at zero
                    grid: {
                        display: true, // Show horizontal grid lines
                        drawBorder: false, // Hide the axis border line
                        color: 'grey' // Set grid line color to white
                    },
                    ticks: {
                        callback: function(value) {
                            return value; // Show data values on y-axis ticks
                        }
                    },
                    color:"#87c11a",
                },
                x: {
                    position: 'bottom', // Ensure labels are at the bottom
                    grid: {
                        display: false, // Hide vertical grid lines
                        color: 'grey' // Set grid line color to white (if needed)
                    },
                    ticks: {
                        color: '#87c11a' // Optional: Change the label color to white
                    }
                }
            },
            plugins: {
                legend: {
                    display: true, // Show legend for the datasets
                    position: 'top', // Position the legend at the top
                }
            }
        }
    });
});
