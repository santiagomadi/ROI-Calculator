document.addEventListener('DOMContentLoaded', () => {
    // 1. Elementos del DOM
    const employeesInput = document.getElementById('employees');
    const salaryInput = document.getElementById('salary');
    const burdenInput = document.getElementById('burden');
    const pingsInput = document.getElementById('pings');
    const pingsValDisplay = document.getElementById('ping-val');
    const turnoverInput = document.getElementById('turnover');
    const unitNameInput = document.getElementById('unit-name');
    
    // Outputs
    const grandTotalDisplay = document.getElementById('grand-total');
    const coiDisplay = document.getElementById('coi-total');
    const prodDisplay = document.getElementById('loss-productivity');
    const turnDisplay = document.getElementById('loss-turnover');
    const outputDisplay = document.getElementById('output-lost');
    const outputLabelDisplay = document.getElementById('output-label-display');
    const chart = document.getElementById('chart-doughnut');

    // 2. Formateadores Profesionales
    function formatEuros(num) {
        return new Intl.NumberFormat('en-IE', { 
            style: 'currency', 
            currency: 'EUR', 
            maximumFractionDigits: 0 
        }).format(num);
    }

    function formatUnits(num) {
        return new Intl.NumberFormat('en-US', { 
            maximumFractionDigits: 0 
        }).format(num);
    }

    // 3. Motor Financiero y Matemático Principal
    function calculateROI() {
        // Capturar valores
        const employees = parseFloat(employeesInput.value) || 0;
        const baseSalary = parseFloat(salaryInput.value) || 0;
        const burdenFactor = parseFloat(burdenInput.value) || 1;
        const dailyPings = parseFloat(pingsInput.value) || 0;
        const turnoverPct = parseFloat(turnoverInput.value) || 0;
        
        // Obtener penalización por complejidad (5, 12, o 25 min)
        const complexityRadio = document.querySelector('input[name="complexity"]:checked');
        const recoveryPenalty = complexityRadio ? parseFloat(complexityRadio.value) : 25;

        // Fórmulas Financieras Core
        const fullyBurdenedSalary = baseSalary * burdenFactor;
        const totalPayroll = employees * fullyBurdenedSalary;
        const costPerMinute = fullyBurdenedSalary / 105600; // 220 días * 8 horas * 60 min

        // Costo de Fricción (Productividad)
        const minsLostPerPing = 2 + recoveryPenalty; // Tiempo físico + Hangover cognitivo
        const totalYearlyMinsLost = minsLostPerPing * dailyPings * 220 * employees;
        const productivityLoss = totalYearlyMinsLost * costPerMinute;

        // Costo de Retención (Burnout)
        const turnoverRiskCost = employees * (turnoverPct / 100) * fullyBurdenedSalary;

        // Totales y Proyecciones
        const totalFinancialLeak = productivityLoss + turnoverRiskCost;
        const costOfInaction5Y = totalFinancialLeak * 5;

        // Impacto Operativo
        let systemicLossPct = 0;
        if (totalPayroll > 0) {
            systemicLossPct = totalFinancialLeak / totalPayroll;
        }
        // Asume 100 unidades de capacidad teórica por empleado al año
        const equivalentOutputLost = (employees * 100) * systemicLossPct;

        // 4. Actualización Visual de la Interfaz
        grandTotalDisplay.textContent = formatEuros(totalFinancialLeak);
        coiDisplay.textContent = `5-Year Cost of Inaction (COI): ${formatEuros(costOfInaction5Y)}`;
        
        prodDisplay.textContent = formatEuros(productivityLoss);
        turnDisplay.textContent = formatEuros(turnoverRiskCost);
        
        outputDisplay.textContent = formatUnits(equivalentOutputLost);

        // Actualizar la Gráfica de Dona (Conic Gradient)
        let chartPercentage = 0;
        if (totalFinancialLeak > 0) {
            chartPercentage = (productivityLoss / totalFinancialLeak) * 100;
        }
        chart.style.setProperty('--pct', chartPercentage);
    }

    // 5. Listeners de Eventos en Tiempo Real
    const allInputs = document.querySelectorAll('input');
    allInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            // Actualizar etiqueta del slider en vivo
            if (e.target.id === 'pings') {
                pingsValDisplay.textContent = e.target.value;
            }
            // Actualizar el nombre de la unidad operativa en vivo
            if (e.target.id === 'unit-name') {
                outputLabelDisplay.textContent = (e.target.value || "UNITS").toUpperCase();
            }
            // Recalcular todo en vivo
            calculateROI();
        });
    });

    // Iniciar cálculo por defecto al cargar la página
    calculateROI();
});

// Función global para el botón de exportar PDF
function exportPDF() {
    window.print();
}
