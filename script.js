document.getElementById("addRow").addEventListener("click", addRow);
document.getElementById("calculate").addEventListener("click", calculate);
document.getElementById("inputTable").addEventListener("click", deleteRow);

function addRow() {
    const row = document.getElementById("inputTable").insertRow(-1);
    const tickerCell = row.insertCell(0);
    const entryCell = row.insertCell(1);
    const tpCell = row.insertCell(2);
    const slCell = row.insertCell(3);
    const winProbabilityCell = row.insertCell(4);
    const deleteCell = row.insertCell(5);

    tickerCell.innerHTML = '<input type="text" class="ticker">';
    entryCell.innerHTML = '<input type="number" class="entry">';
    tpCell.innerHTML = '<input type="number" class="tp">';
    slCell.innerHTML = '<input type="number" class="sl">';
    winProbabilityCell.innerHTML = '<input type="number" class="winProbability">';
    deleteCell.innerHTML = '<button class="deleteRowBtn">x</button>';
	const tickerInput = tickerCell.querySelector(".ticker");
    tickerInput.focus();
}

function deleteRow(event) {
    if (event.target && event.target.classList.contains("deleteRowBtn")) {
        const row = event.target.parentElement.parentElement;
        row.parentElement.removeChild(row);
    }
}

function calculate() {
    const tickers = Array.from(document.getElementsByClassName("ticker")).map(el => el.value);
    const entries = Array.from(document.getElementsByClassName("entry")).map(el => parseFloat(el.value));
    const tps = Array.from(document.getElementsByClassName("tp")).map(el => parseFloat(el.value));
    const sls = Array.from(document.getElementsByClassName("sl")).map(el => parseFloat(el.value));
    const winProbabilities = Array.from(document.getElementsByClassName("winProbability")).map(el=> parseFloat(el.value));

    const tradingStack = parseFloat(document.getElementById("tradingStack").value);

    const kellyValues = entries.map((entry, i) => {
		const rr = Math.abs((tps[i] - entry) / (entry - sls[i]));
		return winProbabilities[i] - ((1 - winProbabilities[i]) / rr);
	});

    let adjustedTradingSizes;
	if (sum(kellyValues) < 1) {
		adjustedTradingSizes = kellyValues.map(kelly_value => kelly_value * tradingStack);
	} else {
		const totalKellyValue = sum(kellyValues);
		adjustedTradingSizes = kellyValues.map(kv => kv * tradingStack / totalKellyValue);
	}


    const resultsTable = document.getElementById("resultsTable");
    for (let i = resultsTable.rows.length - 1; i > 0; i--) {
        resultsTable.deleteRow(i);
    }

    tickers.forEach((ticker, i) => {
        const row = resultsTable.insertRow(-1);
        const tickerCell = row.insertCell(0);
        const rrCell = row.insertCell(1);
        const sizeCell = row.insertCell(2);

        tickerCell.textContent = ticker;
        rrCell.textContent = (tps[i] - entries[i]) / (entries[i] - sls[i]);
        sizeCell.textContent = adjustedTradingSizes[i].toFixed(2);
    });
}

function sum(arr) {
    return arr.reduce((acc, val) => acc + val, 0);
}

function setTradingStackContainerWidth() {
    const dataTable = document.querySelector('.data-table');
    const tradingStackContainer = document.querySelector('.trading-stack-container');

    if (dataTable && tradingStackContainer) {
        tradingStackContainer.style.width = dataTable.offsetWidth + 'px';
        tradingStackContainer.style.margin = '0 auto';
    }
}

setTradingStackContainerWidth();
window.addEventListener('resize', setTradingStackContainerWidth);

window.onload = function() {
    document.getElementById("tradingStack").focus();
};

document.getElementById('darkModeToggle').addEventListener('change', function () {
    document.body.classList.toggle('dark-mode');
});
