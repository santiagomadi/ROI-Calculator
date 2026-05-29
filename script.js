<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Calculadora de Coste de Interrupciones</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      margin: 20px; 
      background: #f8f9fa; 
    }
    .container { 
      max-width: 1000px; 
      margin: auto; 
      background: white; 
      padding: 30px; 
      border-radius: 10px; 
      box-shadow: 0 4px 12px rgba(0,0,0,0.1); 
    }
    h1 { 
      text-align: center; 
      color: #2c3e50; 
    }
    label { 
      display: block; 
      margin: 12px 0 6px; 
      font-weight: bold; 
    }
    input, select { 
      width: 100%; 
      padding: 10px; 
      border: 1px solid #ccc; 
      border-radius: 6px; 
    }
    button { 
      margin-top: 20px; 
      padding: 12px 24px; 
      font-size: 16px; 
      background: #3498db; 
      color: white; 
      border: none; 
      border-radius: 6px; 
      cursor: pointer; 
    }
    button:hover { 
      background: #2980b9; 
    }
    .result { 
      font-size: 1.4em; 
      font-weight: bold; 
      margin: 15px 0; 
      color: #2c3e50;
    }
    .doughnut {
      width: 180px;
      height: 180px;
      border-radius: 50%;
      background: conic-gradient(#e74c3c var(--pct), #3498db var(--pct));
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 30px auto;
      position: relative;
    }
    .doughnut::after {
      content: '';
      width: 120px;
      height: 120px;
      background: white;
      border-radius: 50%;
    }
  </style>
</head>
<body>

<div class="container">
  <h1>Calculadora de Coste de Interrupciones y Rotación</h1>

  <label>Número de empleados</label>
  <input type="number" id="inp-employees" value="50" oninput="calculateAll()">

  <label>Salario base anual (€)</label>
  <input type="number" id="inp-salary" value="45000" oninput="calculateAll()">

  <label>Factor de carga (burden) - recomendado 1.3</label>
  <input type="number" id="inp-burden" value="1.3" step="0.1" oninput="calculateAll()">

  <label>Pings diarios por empleado</label>
  <input type="range" id="inp-pings" min="0" max="100" value="25" oninput="updatePingLabel()">
  <div><strong id="ping-val">25</strong> pings/día</div>

  <label>Rotación anual (%)</label>
  <input type="number" id="inp-turnover" value="18" step="0.1" oninput="calculateAll()">

  <label>Nombre de la unidad/producto</label>
  <input type="text" id="inp-unit-name" value="Unidades" oninput="calculateAll()">

  <fieldset>
    <legend>Penalización por complejidad</legend>
    <label><input type="radio" name="complexity" value="0" checked onchange="calculateAll()"> Baja</label>
    <label><input type="radio" name="complexity" value="2" onchange="calculateAll()"> Media</label>
    <label><input type="radio" name="complexity" value="5" onchange="calculateAll()"> Alta</label>
  </fieldset>

  <button onclick="calculateAll()">Calcular Ahora</button>

  <hr>

  <h2>Resultados</h2>
  <p><strong>Nombre de unidad:</strong> <span id="display-unit-name">Unidades</span></p>

  <p>Pérdida por baja productividad: <span id="out-prod-loss" class="result">—</span></p>
  <p>Coste de rotación: <span id="out-turnover-cost" class="result">—</span></p>
  <p><strong>Total fuga anual:</strong> <span id="out-total" class="result">—</span></p>
  <p><strong>Coste en 5 años:</strong> <span id="out-5year" class="result">—</span></p>

  <p><strong>Unidades de output perdidas equivalentes:</strong> <span id="out-units" class="result">—</span></p>

  <div class="doughnut" id="doughnut-chart" style="--pct: 65;"></div>
  <p style="text-align:center;"><strong>Distribución de la fuga</strong><br>(rojo = productividad | azul = rotación)</p>
</div>

<script>
const formatEur = new Intl.NumberFormat('en-IE', { 
  style: 'currency', 
  currency: 'EUR', 
  maximumFractionDigits: 0 
});

const formatNum = new Intl.NumberFormat('en-US');

function updatePingLabel() {
  document.getElementById('ping-val').innerText = document.getElementById('inp-pings').value;
}

function calculateAll() {
  let employees = parseFloat(document.getElementById('inp-employees').value) || 0;
  let baseSalary = parseFloat(document.getElementById('inp-salary').value) || 0;
  let burden = parseFloat(document.getElementById('inp-burden').value) || 1;

  let complexityPenalty = parseFloat(document.querySelector('input[name="complexity"]:checked').value) || 0;

  let dailyPings = parseFloat(document.getElementById('inp-pings').value) || 0;
  let turnoverPct = parseFloat(document.getElementById('inp-turnover').value) || 0;
  let unitName = document.getElementById('inp-unit-name').value || "Units";

  document.getElementById('display-unit-name').innerText = unitName;

  // Matemáticas base
  let burdenedSalary = baseSalary * burden;
  let totalPayroll = employees * burdenedSalary;
  let costPerMinute = burdenedSalary / 105600;

  // Pérdidas de tiempo
  let minsLostPerPing = 2 + complexityPenalty;
  let minsLostPerDay = minsLostPerPing * dailyPings;
  let totalMinsLostYearly = minsLostPerDay * 220 * employees;
  let productivityLoss = totalMinsLostYearly * costPerMinute;

  // Costo de Rotación
  let turnoverCost = employees * (turnoverPct / 100) * burdenedSalary;

  // Totales y 5-Años
  let totalLeak = productivityLoss + turnoverCost;
  let fiveYearCOI = totalLeak * 5;

  // Outputs Operativos
  let lossPercentage = totalPayroll > 0 ? totalLeak / totalPayroll : 0;
  let totalCapacity = employees * 100;
  let equivalentOutputLost = totalCapacity * lossPercentage;

  // Actualizar Textos
  document.getElementById('out-prod-loss').innerText = formatEur.format(productivityLoss);
  document.getElementById('out-turnover-cost').innerText = formatEur.format(turnoverCost);
  document.getElementById('out-total').innerText = formatEur.format(totalLeak);
  document.getElementById('out-5year').innerText = formatEur.format(fiveYearCOI);
  document.getElementById('out-units').innerText = formatNum.format(Math.round(equivalentOutputLost));

  // Animar gráfico de dona
  const doughnut = document.getElementById('doughnut-chart');
  if(totalLeak > 0) {
    let prodPct = (productivityLoss / totalLeak) * 100;
    doughnut.style.setProperty('--pct', prodPct);
  } else {
    doughnut.style.setProperty('--pct', 0);
  }
}

// Inicializar al cargar
window.onload = function() {
  calculateAll();
};
</script>

</body>
</html>