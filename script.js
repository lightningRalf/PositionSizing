document.addEventListener('DOMContentLoaded', () => {
    const themeSwitch = document.getElementById('theme-switch');
    const tradesForm = document.getElementById('trades-form');
    const tradesInput = document.getElementById('trades-input');
    const resultsTable = document.getElementById('results');

    themeSwitch.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
    });

    document.getElementById('trading-stack').focus();
    addRow();

    tradesForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        tradesInput.classList.add('hidden');
        resultsTable.classList.remove('hidden');

        const tradingStack = parseFloat(document.getElementById('trading-stack').value);
        const trades = Array.from(tradesInput.rows)
            .map(row => {
                const inputs = row.querySelectorAll('input');
                const ticker = inputs[0].value;
                const entry = parseFloat(inputs[1].value);
                const tp = parseFloat(inputs[2].value);
                const sl = parseFloat(inputs[3].value);
                const winProbability = parseFloat(inputs[4].value);

                const rr = Math.abs((tp - entry) / (sl - entry));
                const kellyFraction = (winProbability * rr - (1 - winProbability)) / rr;
                const tradeSize = tradingStack * kellyFraction;

                return { ticker, tradeSize };
            });

        trades.forEach((trade, index) => {
            const row = resultsTable.insertRow();
            const tickerCell = row.insertCell();
            const tradeSizeCell = row.insertCell();
            tickerCell.textContent = trade.ticker;
            tradeSizeCell.textContent = trade.tradeSize.toFixed(2);
        });
    });
});

function addRow() {
    const row = tradesInput.insertRow();
    for (let i = 0; i < 5; i++) {
        const cell = row.insertCell();
        const input = document.createElement('input');
        input.type = i === 0 ? 'text' : 'number';
        input.required = true;
        input.tabIndex = i + 1;
        cell.appendChild(input);
    }

    const winProbabilityInput = row.querySelector('input:nth-child(5)');
    winProbabilityInput.addEventListener('focus', () => {
        addRow();
    });

    winProbabilityInput.addEventListener('keydown', (event) => {
        if (event.key === 'Tab') {
            event.preventDefault();
            addRow();
        }
    });

    winProbabilityInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            tradesForm.submit();
        }
    });
}
