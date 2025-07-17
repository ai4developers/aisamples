async function loadSalesData() {
  const res = await fetch('/api/sales');
  const data = await res.json();

  const sales = data.sales;
  const forecast = data.forecast;

  // Populate table
  const tbody = document.querySelector('#sales-table tbody');
  sales.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${row.month}</td><td>${row.sales}</td>`;
    tbody.appendChild(tr);
  });

  // Prepare chart data
  const labels = sales.map(r => r.month).concat(forecast.map(f => f.month));
  const salesValues = sales.map(r => r.sales);
  const forecastValues = new Array(sales.length - 1).fill(null)
    .concat([sales[sales.length-1].sales])
    .concat(forecast.map(f => f.sales));

  // Chart
  const ctx = document.getElementById('salesChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Sales',
          data: salesValues,
          borderColor: 'blue',
          backgroundColor: 'rgba(0,0,255,0.1)',
          tension: 0.3
        },
        {
          label: 'Forecast',
          data: forecastValues,
          borderColor: 'green',
          borderDash: [5,5],
          backgroundColor: 'rgba(0,255,0,0.1)',
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

loadSalesData();
