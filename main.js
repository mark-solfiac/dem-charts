const ctx1 = document.getElementById("pop-pyramid").getContext("2d");
const ctx2 = document.getElementById("pop-chart").getContext("2d");
const ctx3 = document.getElementById("pop-percentages").getContext("2d");

const chartGroupOrder = [
  "White British",
  "White Other",
  "Asian",
  "Black",
  "Mixed",
  "Other",
];

const colors = {
  "White British": "#ffd7ae",
  "White Other": "#eac086",
  Other: "#ebab7f",
  Asian: "#8a5343",
  Black: "#3d0c02",
  Mixed: "#af6e51",
};

const totalsByAgeGroup = {};
const ageGroups = [];

for (const [key, val] of Object.entries(rawData["All"][0])) {
  if (key != "Sex") {
    ageGroups.push(key);
    totalsByAgeGroup[key] = val;
  }
}

const pyramidData = {
  labels: ageGroups.toReversed(),
  datasets: [],
};

const chartData = {
  labels: ageGroups,
  datasets: [],
};

const percentagesData = {
  labels: ageGroups,
  datasets: [],
};

for (const ethnicity of chartGroupOrder.toReversed()) {
  for (const group of rawData[ethnicity]) {
    if (group.Sex === "All") {
      const rawValues = [];
      const percentValues = [];
      for (const [key, val] of Object.entries(group)) {
        if (!isNaN(val)) {
          rawValues.push(val);
          percentValues.push((val / totalsByAgeGroup[key]) * 100);
        }
      }
      chartData.datasets.unshift({
        label: ethnicity,
        data: rawValues,
        backgroundColor: colors[ethnicity],
      });
      percentagesData.datasets.unshift({
        label: ethnicity,
        data: percentValues,
        backgroundColor: colors[ethnicity],
      });
    } else {
      const label = `${ethnicity} ${group.Sex}`;
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
        backgroundColor: colors[ethnicity],
      });
    }
  }
}

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
      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.dataset.label}: ${Math.abs(
              context.parsed.x
            ).toLocaleString()}`,
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
    },
  },
};

new Chart(ctx1, pyramidConfig);
new Chart(ctx2, chartConfig);
new Chart(ctx3, percentagesConfig);
