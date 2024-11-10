document.addEventListener("DOMContentLoaded", () => {
  const timeList = document.getElementById("timeList");
  const ctx = document.getElementById("timeChart").getContext("2d");
  function updateTimeDisplay() {
    chrome.storage.local.get("timeSpent", (data) => {
      const timeData = data.timeSpent || {};
      const labels = Object.keys(timeData);
      const timeValues = Object.values(timeData).map((seconds) =>
        Math.round(seconds)
      );
      const sortedData = labels
        .map((domain, i) => ({ domain, time: timeValues[i] }))
        .sort((a, b) => b.time - a.time);
      const sortedLabels = sortedData.map((item) => item.domain);
      const sortedValues = sortedData.map((item) => item.time);
      timeList.innerHTML = "";

      if (sortedLabels.length === 0) {
        const emptyMessage = document.createElement("li");
        emptyMessage.textContent = "No data available yet.";
        timeList.appendChild(emptyMessage);
      } else {
        sortedLabels.forEach((domain, i) => {
          const listItem = document.createElement("li");
          listItem.innerHTML = `<span class="domain">${domain}</span> <span class="time">${formatTime(
            sortedValues[i]
          )}</span>`;
          timeList.appendChild(listItem);
        });
      }
      if (sortedLabels.length > 0) {
        if (window.myChart) {
          window.myChart.destroy();
        }

        window.myChart = new Chart(ctx, {
          type: "pie",
          data: {
            labels: sortedLabels,
            datasets: [
              {
                data: sortedValues,
                backgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56",
                  "#4BC0C0",
                  "#9966FF",
                  "#FF9F40",
                  "#FF5733",
                  "#C70039",
                  "#FFC300",
                  "#DAF7A6",
                ],
              },
            ],
          },
          options: {
            animation: {
              duration: 0,
            },
            responsive: true,
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  color: "rgba(0, 0, 0, 0.87)",
                },
              },
              tooltip: {
                callbacks: {
                  label: (tooltipItem) =>
                    `${tooltipItem.label}: ${formatTime(tooltipItem.raw)}`,
                },
              },
            },
          },
        });
      }
    });
  }
  setInterval(() => {
    updateTimeDisplay();
  }, 1000);
});

function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs}h ${mins}m ${secs}s`;
  } else if (mins > 0) {
    return `${mins}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

// document.getElementById("resetButton").addEventListener("click", () => {
//   chrome.storage.local.clear(() => {
//     timeList.innerHTML = "";
//     const message = document.createElement("li");
//     message.textContent = "Data reset.";
//     timeList.appendChild(message);
//     if (window.myChart) window.myChart.destroy();
//   });
// });
