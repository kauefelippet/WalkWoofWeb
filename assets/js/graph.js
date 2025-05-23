document.addEventListener('DOMContentLoaded', () => {
  // Parâmetros
  const alpha = 2.31;   // kg CO₂ por litro
  const Cmax  = 200;    // capacidade de compensação
  const beta  = 0.05;   // taxa de saturação

  // Funções de cálculo
  function emissaoPura(v) {
    return alpha * v;
  }
  function emissaoLiquida(v) {
    const C = Cmax * (1 - Math.exp(-beta * v));
    return emissaoPura(v) - C;
  }

  // Elementos
  const slider = document.getElementById('volumeSlider');
  const label  = document.getElementById('volumeValue');
  const ctxOnly = document.getElementById('co2ChartOnly').getContext('2d');
  const ctxComp = document.getElementById('co2Chart').getContext('2d');

  // Cria o gráfico de emissão pura
  const chartOnly = new Chart(ctxOnly, {
    type: 'line',
    data: {
      labels: [ +slider.value ],
      datasets: [{
        label: 'CO₂ Emitido (kg)',
        data: [ emissaoPura(+slider.value) ],
        borderColor: 'rgb(98,58,43)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 5
      }]
    },
    options: { scales: { x: { title: { display: true, text: 'Litros' } }, 
                         y: { beginAtZero: true, title: { display: true, text: 'kg CO₂' } } } }
  });

  // Cria o gráfico de emissão líquida (já existente)
  const chartComp = new Chart(ctxComp, {
    type: 'line',
    data: {
      labels: [ +slider.value ],
      datasets: [{
        label: 'Emissão Líquida (kg CO₂)',
        data: [ emissaoLiquida(+slider.value) ],
        borderColor: 'rgb(98,58,43)',
        backgroundColor: 'rgba(98,58,43,0.2)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 5
      }]
    },
    options: { scales: { x: { title: { display: true, text: 'Litros' } }, 
                         y: { beginAtZero: true, title: { display: true, text: 'kg CO₂' } } } }
  });

  // Atualiza ambos ao mover o slider
  slider.addEventListener('input', () => {
    const v = +slider.value;
    label.textContent = v;
    const xs = Array.from({ length: v }, (_, i) => i + 1);

    chartOnly.data.labels = xs;
    chartOnly.data.datasets[0].data = xs.map(emissaoPura);
    chartOnly.update();

    chartComp.data.labels = xs;
    chartComp.data.datasets[0].data = xs.map(emissaoLiquida);
    chartComp.update();
  });
});
