const formatEur = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
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
    let lossPercentage = totalLeak / totalPayroll;
    let totalCapacity = employees * 100; 
    let equivalentOutputLost = totalCapacity * lossPercentage;

    // Actualizar Textos
    document.getElementById('out-prod-loss').innerText = formatEur.format(productivityLoss);
    document.getElementById('out-turnover-cost').innerText = formatEur.format(turnoverCost);
    document.getElementById('out-total').innerText = formatEur.format(totalLeak);
    document.getElementById('out-5year').innerText = formatEur.format(fiveYearCOI);
    document.getElementById('out-units').innerText = formatNum.format(Math.round(equivalentOutputLost));

    // ANIMAR EL GRÁFICO DE DONA 
    if(totalLeak > 0) {
        let prodPct = (productivityLoss / totalLeak) * 100;
        document.getElementById('doughnut-chart').style.setProperty('--pct', prodPct);
    } else {
        document.getElementById('doughnut-chart').style.setProperty('--pct', 0);
    }
}

// Inicializar al cargar
window.onload = function() {
    calculateAll();
};
