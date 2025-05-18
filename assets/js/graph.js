// Parâmetros
const alpha = 2.31;   // kg CO₂ por litro de gasolina
const Cmax = 200;    // capacidade máxima renovável (kg CO₂)
const beta = 0.05;   // taxa de saturação exponencial

// Cálculo da emissão líquida
function calcularEmissaoLiquida(v) {
        const E = alpha * v;
        const C = Cmax * (1 - Math.exp(-beta * v));
        return E - C;
}

// Referências aos elementos
const slider = document.getElementById('volumeSlider');
const label = document.getElementById('volumeValue');
const ctx = document.getElementById('co2Chart').getContext('2d');

  // inicializa o gráfico
  const co2Chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [ +slider.value ],
      datasets: [{
        label: 'Emissão Líquida (kg CO₂)',
        data: [ calcularEmissaoLiquida(+slider.value) ],
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        borderWidth: 2,
        borderColor: 'rgb(98,58,43)',
        backgroundColor: 'rgba(98,58,43,0.2)'
      }]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Volume de Gasolina (L)'
                    },
                    min: 0,
                    max: 100
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Emissão Líquida de CO₂ (kg)'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: ctx => `${ctx.formattedValue} kg CO₂`
                    }
                },
                legend: {
                    display: false
                }
            }
        }
    });

    // Atualiza o gráfico e o valor exibido ao mover o slider
    slider.addEventListener('input', () => {
        const v = +slider.value;
        label.textContent = v;

        // Atualiza dados
        co2Chart.data.labels = Array.from({ length: v }, (_, i) => i + 1);
        co2Chart.data.datasets[0].data = co2Chart.data.labels.map(x => calcularEmissaoLiquida(x));
        co2Chart.update();
    });