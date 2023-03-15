document.addEventListener('DOMContentLoaded', () => {
    const themeSwitch = document.getElementById('theme-switch');
    const tradesForm = document.getElementById('trades-form');
    const tradesInput = document.getElementById('trades-input');
    const resultsTable = document.getElementById('results');

    themeSwitch.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
    });

    addRow();

    tradesForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const tradingStack = parseFloat(document.getElementById('trading-stack').value);
        const tradeData = Array.from(tradesInput.querySelectorAll('tr'))
            .slice(1)
            .map(row => {
                const inputs = row.querySelectorAll('input');
                const ticker = inputs[0].value;
                const entry = parseFloat(inputs[1].value);
                const tp = parseFloat(inputs[2].value);
                const sl = parseFloat(inputs[3].value);
                const winProbability = parseFloat(inputs[4].value);

                return { ticker, entry, tp, sl, winProbability };
            });

        const results = calculate(tradeData, tradingStack);
        displayResults(results);

        tradesForm.classList.add('hidden');
        resultsTable.classList.remove('hidden');
    });

    function addRow() {
        const row = tradesInput.insertRow();
        for (let i = 0; i < 5; i++) {
            const cell = row.insertCell();
            const input = document.createElement('input');
            input.type = i < 4 ? 'number' : 'text';
            input.required = true;
            input.tabIndex = i + 1; 
            cell.appendChild(input);
        }

        const winProbabilityInput = row.querySelector('input:nth-child(5)');
        winProbabilityInput.addEventListener('focus', () => {
            addRow();
        });
    }

    function calculate(tradeData, tradingStack) {
        const results = tradeData.map(data => {
            const rr = (data.tp - data.entry) / (data.entry - data.sl);
            const kellyValue = kelly_criterion(data.winProbability, rr);
            const tradingSize = tradingStack * kellyValue;
            return { ticker: data.ticker, rr, kellyValue, tradingSize };
        });

        return results;
    }

    function kelly_criterion(winProbability, rr) {
        return (winProbability * rr - (1 - winProbability)) / rr;
    }

    function displayResults(results) {
        resultsTable.innerHTML = `
            <tr>
                <th>Ticker</th>
                <th>RR</th>
                <th>Kelly Value</th>
                <th>Trading Size</th>
            </tr>
        `;

        for (const result of results) {
            const row = resultsTable.insertRow();
            row.insertCell().textContent = result.ticker;
            row.insertCell().textContent = result.rr.toFixed(2);
            row.insertCell().textContent = result.kellyValue.toFixed(2);
            row.insertCell().textContent = result.tradingSize.toFixed(2);
        }
    }
});
