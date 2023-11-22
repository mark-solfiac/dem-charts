const ctx1 = document.getElementById("pop-pyramid").getContext("2d");
const ctx2 = document.getElementById("pop-chart").getContext("2d");
const ctx3 = document.getElementById("pop-percentages").getContext("2d");

const colors = {
  "White British": "blue",
  "White Other": "green",
  "Other": "grey",
  "Asian": "brown",
  "Black": "black",
  "Mixed": "purple",
};

const pyramidData = {
  labels: Object.keys(rawData[0])
    .toReversed()
    .filter((x) => !["Ethnicity", "Sex"].includes(x)),
  datasets: [],
};

const chartData = structuredClone(pyramidData);
const percentagesData = structuredClone(pyramidData);

for (const group of rawData.toReversed()) {
  console.log(group);
  // pyramidData.labels.push(ageGroup.Age);
  if (group.Sex === 'All') {
    if (group.Ethnicity === 'All') {
      continue;
    }
    const rawValues = [];
    for (const val of Object.values(group)) {
      if (!isNaN(val)) {
        rawValues.push(val);
      }
    }
    chartData.datasets.unshift({
      label: group.Ethnicity,
      data: rawValues,
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

// console.log(pyramidData);



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
  },
};

const chartConfig = {
  type: "bar",
  data: chartData,
  options: {
    // indexAxis: "y",
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
  },
};

const percentagesConfig = {
  type: "bar",
  data: percentagesData,
  options: {
    // indexAxis: "y",
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
  },
};

new Chart(ctx1, pyramidConfig);
new Chart(ctx2, chartConfig);
new Chart(ctx3, percentagesConfig);
