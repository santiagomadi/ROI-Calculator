// Formateadores globales
const formatEur = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const formatNum = new Intl.NumberFormat('en-US');

// Sincroniza la etiqueta de texto del slider de pings
function updatePingLabel() {
    document.getElementById('ping-val').innerText = document.getElementById('inp-pings').value;
}

// Motor central de cálculo matemático y financiero
function calculateAll() {
    // 1. Captura de datos desde la interfaz
    let employees = parseFloat(document.getElementById('inp-employees').value) || 0;
    let baseSalary = parseFloat(document.getElementById('inp-salary').value) || 0;
    let burden = parseFloat(document.getElementById('inp-burden').value) || 1;
    
    // Capturar la tarjeta de complejidad que esté activada (Radio Button)
    let complexityPenalty = parseFloat(document.querySelector('input[name="complexity"]:checked').value) || 0;
    
    let dailyPings = parseFloat(document.getElementById('inp-pings').value) || 0;
    let turnoverPct = parseFloat(document.getElementById('inp-turnover').value) || 0;
    let unitName = document.getElementById('inp-unit-name').value || "Units";

    // Actualizar nombre dinámico de la unidad en la interfaz
    document.getElementById('display-unit-name').innerText = unitName;

    // 2. Operaciones Financieras Base (Fully Burdened Labor Cost)
    let burdenedSalary = baseSalary * burden; 
    let totalPayroll = employees * burdenedSalary;
    let costPerMinute = burdenedSalary / 105600; // 220 días laborables * 8 horas * 60 minutos

    // 3. Pérdida Operativa por Fricción (Productivity Loss)
    let minsLostPerPing = 2 + complexityPenalty; // Tiempo físico de lectura + Resaca cognitiva
    let minsLostPerDay = minsLostPerPing * dailyPings;
    let totalMinsLostYearly = minsLostPerDay * 220 * employees;
    let productivityLoss = totalMinsLostYearly * costPerMinute;

    // 4. Impacto por Deserción y Reclutamiento (Turnover Risk)
    let turnoverCost = employees * (turnoverPct / 100) * burdenedSalary;

    // 5. Consolidación de Totales y Costo a Largo Plazo (5-Year COI)
    let totalLeak = productivityLoss + turnoverCost;
    let fiveYearCOI = totalLeak * 5;

    // 6. Equivalencia Operativa de Unidades de Negocio Perdidas
    let lossPercentage = totalLeak / totalPayroll;
    let totalCapacity = employees * 100; // Capacidad teórica base de 100 unidades por persona/año
    let equivalentOutputLost = totalCapacity * lossPercentage;

    // 7. Inyección de Resultados en el HTML con formatos limpios
    document.getElementById('out-prod-loss').innerText = formatEur.format(productivityLoss);
    document.getElementById('out-turnover-cost').innerText = formatEur.format(turnoverCost);
    document.getElementById('out-total').innerText = formatEur.format(totalLeak);
    document.getElementById('out-5year').innerText = formatEur.format(fiveYearCOI);
    document.getElementById('out-units').innerText = formatNum.format(Math.round(equivalentOutputLost));

    // 8. Actualización Dinámica del Gráfico de Dona por Variables CSS
    if (totalLeak > 0) {
        let prodPct = (productivityLoss / totalLeak) * 100;
        // Cambia la variable CSS '--pct' para redibujar el gradiente cónico de la dona
        document.getElementById('doughnut-chart').style.setProperty('--pct', prodPct);
    } else {
        document.getElementById('doughnut-chart').style.setProperty('--pct', 0);
    }
}

// Ejecutar automáticamente el cálculo inicial cuando la página termine de cargar
window.onload = function() {
    calculateAll();
};
