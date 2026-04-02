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
        const response = await fetch('http://localhost:5000/fetch-data', {
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
        c: item.close
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

    document.getElementById('prevBtn').disabled = (currentDayIndex === 0);
    document.getElementById('nextBtn').disabled = (currentDayIndex === days.length - 1);
}

function nextDay() {
    currentDayIndex++;

    RenderChartForCurrentDay();

}

function prevDay() {
    currentDayIndex--;

    RenderChartForCurrentDay();
}