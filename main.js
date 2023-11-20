const ctx = document.getElementById('populationPyramid').getContext('2d');

const data = {
  labels: ['0-4', '5-9', '10-14', '15-19', '20-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60-64', '65-69', '70-74', '75-79', '80+'],
  datasets: [{
    label: 'Male',
    data: [-10, -20, -30, -40, -50, -60, -70, -80, -90, -100, -110, -120, -130, -140, -150, -160, -170], // negative values for left side
    backgroundColor: 'blue'
  }, {
    label: 'Female',
    data: [15, 25, 35, 45, 55, 65, 75, 85, 95, 105, 115, 125, 135, 145, 155, 165, 175], // positive values for right side
    backgroundColor: 'pink'
  }, {
    label: 'Other',
    data: [-180], // positive values for right side
    backgroundColor: 'red'
  }]
};

const config = {
  type: 'bar',
  data: data,
  options: {
    indexAxis: 'y',
    scales: {
      x: {
        stacked: true,
        ticks: {
          callback: (value) => Math.abs(value) // this makes the labels positive
        }
      },
      y: {
        stacked: true
      }
    }
  }
};

new Chart(ctx, config);
