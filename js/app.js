let stockChart = null;
let allFinancialdata = [];
let days = [];
let currentDayIndex = 0;

const btn = document.getElementById('fetchbutton');

btn.addEventListener('click', async () => {
    btn.textContent = "Fetching Data ";
    btn.disabled = true;

    const stock = document.getElementById('Stocks').value; //set the value of stock as per drop down

    try {
        // uncomment this if using local server and put in correct port number instead of 5000 
        // const response = await fetch('http://localhost:5000/fetch-data', {
        const response = await fetch('https://finlaytics-visualizer.onrender.com/fetch-data', {
            method: 'POST', headers:
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ stock: stock })
        })

        const data = await response.json();

        if (response.ok) {

            allFinancialdata = data.chartData.map(buildChartInfo);

            let daysCumm = new Set(allFinancialdata.map(item => item.dateLabel));
            //days = [... new Set(allFinancialdata.map(item => item.dateLabel))];

            days = [...daysCumm]; // unique dates 

            currentDayIndex = days.length - 1;

            RenderChartForCurrentDay();
        }
        else
            alert("Failed" + data.message);
    }
    catch (error) {
        alert("Could not connect make sure the server is active")
    }

    finally {
        btn.textContent = "Fetch stock data";
        btn.disabled = false;
    }
}
)

const nextbtn = document.getElementById('nextBtn');
const prevbtn = document.getElementById('prevBtn');

nextbtn.addEventListener('click', nextDay);
prevbtn.addEventListener('click', prevDay);

function buildChartInfo(item) {
    let dayString = item.time.split(" ")[0];

    return {
        dateLabel: dayString,
        x: luxon.DateTime.fromISO(item.time.replace(" ", "T")).valueOf(),
        o: item.open,
        h: item.high,
        l: item.low,
        c: item.close,
        y: item.close
    }
}

function RenderChartForCurrentDay() {
    const targetDay = days[currentDayIndex];

    const dayData = allFinancialdata.filter(item => item.dateLabel === targetDay);

    console.log("1. Total Days Found:", days);
    console.log("2. Target Day Selected:", targetDay);
    console.log("3. Payload sent to Chart:", dayData);

    const ctx = document.getElementById('financialchart').getContext('2d');

    if (stockChart) {
        stockChart.destroy();
    }

    let stockName = document.getElementById('Stocks').value;

    let chartOption = document.getElementById('Charts').value;

    switch(chartOption)
    {
        case 'Candle':
            RenderCandleStick(ctx, stockName, targetDay, dayData);
            break;
        case 'Area':
            RenderAreaChart(ctx, stockName, targetDay, dayData);
            break;
        case 'Line':
            RenderLineChart(ctx, stockName, targetDay, dayData);
            break;
        default:
            RenderCandleStick(ctx, stockName, targetDay, dayData);
            break;
    }

    

    document.getElementById('prevBtn').disabled = (currentDayIndex === 0);
    document.getElementById('nextBtn').disabled = (currentDayIndex === days.length - 1);
}

function RenderCandleStick(ctx, stockName, targetDay, dayData) {
    stockChart = new Chart(ctx, {
        type: 'candlestick',
        data: {
            datasets: [{
                label: `${stockName} Hourly Chart - ${targetDay}`,
                data: dayData
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'hour'
                    }
                }
            }
        }
    });
}

function RenderAreaChart(ctx, stockName, targetDay, dayData) {
    stockChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: `${stockName} Hourly Area Chart - ${targetDay}`,
                data: dayData,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.1
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: { unit: 'hour' }
                }
            }
        }
    });
}

function RenderLineChart(ctx, stockName, targetDay, dayData) {
    stockChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: `${stockName} Hourly Line Chart - ${targetDay}`,
                data: dayData,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: { unit: 'hour' }
                }
            }
        }
    });
}

function nextDay() {
    currentDayIndex++;

    RenderChartForCurrentDay();

}

function prevDay() {
    currentDayIndex--;

    RenderChartForCurrentDay();
}
