const DOWNLOAD_PATH = "data/test-results.json";

async function loadTestResultsFromJson(filePath) {
  try {
    console.log("Fetching data");

    const response = await fetch(filePath, {cache: "no-store"});
    if (!response.ok) {
      console.log("Not able to fetch data");
      throw new Error("Network response was not ok");
    }
    const testData = await response.json();
    console.log(testData);
    return testData;
  } catch (error) {
    console.error(`Error reading from ${DOWNLOAD_PATH}:`, error);
    return null;
  }
}

function updateDOMWithTestResults(testData) {
    console.log("Putting data to the table");

    if (testData && testData.results) {
        const tableBody = document.querySelector('#resultsTable tbody');
        tableBody.innerHTML = ''; // Reset table body

        testData.results.forEach(scriptResults => {
            for (const [filename, tests] of Object.entries(scriptResults)) {
                let row = document.createElement('tr');
                row.innerHTML += `<td>${filename}</td>`;

                for (let i = 0; i < 5; i++) {
                    const test = tests[i];
                    let cell = document.createElement('td');
                    if (test) {
                        cell.textContent = test[1] ? "Passed ✅" : "Failed ❌";
                        cell.style.color = test[1] ? "rgb(63, 185, 80)" : "rgb(248, 81, 73)";
                    } else {
                        cell.textContent = 'N/A';
                        cell.style.color = 'yellow'; // Mark as N/A
                    }
                    row.appendChild(cell);
                }

                tableBody.appendChild(row);
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {
  loadTestResultsFromJson(DOWNLOAD_PATH).then((testData) => {
    if (testData) {
      updateDOMWithTestResults(testData);
    }
  });
});
