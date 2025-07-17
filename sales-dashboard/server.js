const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static('public'));

// Load sales data
const salesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'sales.json')));

// Forecast next 3 months (simple linear forecast based on average growth)
function forecastSales(data) {
  const lastSales = data.map(d => d.sales);
  let diffs = [];
  for (let i = 1; i < lastSales.length; i++) {
    diffs.push(lastSales[i] - lastSales[i - 1]);
  }
  const avgGrowth = diffs.reduce((a, b) => a + b, 0) / diffs.length;
  const forecasts = [];
  let lastMonth = data[data.length - 1].month;
  let lastSalesValue = data[data.length - 1].sales;

  for (let i = 1; i <= 3; i++) {
    // Calculate next month string
    const [year, month] = lastMonth.split('-').map(Number);
    let newMonth = month + i;
    let newYear = year;
    while (newMonth > 12) {
      newMonth -= 12;
      newYear += 1;
    }
    const monthStr = newMonth.toString().padStart(2, '0');
    const newMonthLabel = `${newYear}-${monthStr}`;
    lastSalesValue += avgGrowth;
    forecasts.push({ month: newMonthLabel, sales: Math.round(lastSalesValue) });
  }

  return forecasts;
}

app.get('/api/sales', (req, res) => {
  res.json({
    sales: salesData,
    forecast: forecastSales(salesData)
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
