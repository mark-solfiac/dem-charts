const ctx1 = document.getElementById("pop-pyramid").getContext("2d");
const ctx2 = document.getElementById("pop-chart").getContext("2d");
const ctx3 = document.getElementById("pop-percentages").getContext("2d");

const colors = {
  "White British": "#ffd7ae",
  "White Other": "#eac086",
  Other: "grey",
  Asian: "#8a5343",
  Black: "#3d0c02",
  Mixed: "#af6e51",
};

const pyramidData = {
  labels: Object.keys(rawData[0])
    .toReversed()
    .filter((x) => !["Ethnicity", "Sex"].includes(x)),
  datasets: [],
};

const chartData = structuredClone(pyramidData);
chartData.labels.reverse();
const percentagesData = structuredClone(chartData);
const totalsByAgeGroup = {};

for (const [key, val] of Object.entries(rawData[0])) {
  if (!isNaN(val)) {
    totalsByAgeGroup[key] = val;
  }
}

for (const group of rawData.toReversed()) {
  // console.log(group);
  if (group.Sex === "All") {
    if (group.Ethnicity === "All") {
      // console.log(totalsByAgeGroup);
      continue;
    }
    const rawValues = [];
    const percentValues = [];
    for (const [key, val] of Object.entries(group)) {
      if (!isNaN(val)) {
        rawValues.push(val);
        percentValues.push((val / totalsByAgeGroup[key]) * 100);
      }
    }
    chartData.datasets.unshift({
      label: group.Ethnicity,
      data: rawValues,
      backgroundColor: colors[group.Ethnicity],
    });
    percentagesData.datasets.unshift({
      label: group.Ethnicity,
      data: percentValues,
      backgroundColor: colors[group.Ethnicity],
    });
  } else {
    const label = `${group.Ethnicity} ${group.Sex}`;
    const coefficient = group.Sex === "Male" ? -1 : 1;
    const rawValues = [];
    for (const val of Object.values(group).toReversed()) {
      if (!isNaN(val)) {
        rawValues.push(val * coefficient);
      }
    }
    pyramidData.datasets.unshift({
      label,
      data: rawValues,
      backgroundColor: colors[group.Ethnicity],
    });
  }
}

console.log(totalsByAgeGroup);
console.log(percentagesData);

const pyramidConfig = {
  type: "bar",
  data: pyramidData,
  options: {
    indexAxis: "y",
    scales: {
      x: {
        stacked: true,
        ticks: {
          callback: (value) => Math.abs(value), // this makes the labels positive
        },
      },
      y: {
        stacked: true,
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Population Pyramid',
        font: {
          size: 30
        },
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.dataset.label}: ${Math.abs(context.parsed.x).toLocaleString()}`,
        },
      },
    },
  },
};

const chartConfig = {
  type: "bar",
  data: chartData,
  options: {
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Total',
        font: {
          size: 30
        },
      },
    },
  },
};

const percentagesConfig = {
  type: "bar",
  data: percentagesData,
  options: {
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        max: 100,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.dataset.label}: ${Math.round(context.parsed.y)}%`,
        },
      },
      title: {
        display: true,
        text: 'Percentages',
        font: {
          size: 30
        },
      },
    },
  },
};

console.log(chartConfig);

new Chart(ctx1, pyramidConfig);
new Chart(ctx2, chartConfig);
new Chart(ctx3, percentagesConfig);
