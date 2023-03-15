function createRow() {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="text" name="ticker" required></td>
        <td><input type="number" step="0.01" name="entry" required></td>
        <td><input type="number" step="0.01" name="tp" required></td>
        <td><input type="number" step="0.01" name="sl" required></td>
        <td><input type="number" step="0.01" min="0" max="1" name="winProbability" required></td>
    `;
    return row;
}

function calculate_rr(entry, tp, sl) {
    return Math.abs((tp - entry) / (entry - sl));
}

function kelly_criterion(win_probability, win_loss_ratio) {
    return win_probability - ((1 - win_probability) / win_loss_ratio);
}

document.addEventListener('DOMContentLoaded', () => {
    const tradesForm = document.getElementById('trades-form');
    const tradesInput = document.getElementById('trades-input');
    const results = document.getElementById('results');
    const addRowButton = document.getElementById('add-row');

    addRowButton.onclick = (event) => {
        event.preventDefault();
        tradesInput.appendChild(createRow());
    };

    tradesForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const tradeInputs = Array.from(tradesInput.querySelectorAll('tr'));
        const trades = tradeInputs.map((row) => {
            const ticker = row.querySelector('[name="ticker"]').value;
            const entry = parseFloat(row.querySelector('[name="entry"]').value);
            const tp = parseFloat(row.querySelector('[name="tp"]').value);
            const sl = parseFloat(row.querySelector('[name="sl"]').value);
            const winProbability = parseFloat(row.querySelector('[name="winProbability"]').value);

            const rr = calculate_rr(entry, tp, sl);
            const kellyValue = kelly_criterion(win_probability, rr);

            return { ticker, entry, tp, sl, winProbability, rr, kellyValue };
        });

        const totalKellyValue = trades.reduce((sum, trade) => sum + trade.kellyValue, 0);

        const tradingStack = parseFloat(prompt('Enter your trading stack:'));

        trades.forEach((trade) => {
            trade.adjustedTradingSize = (trade.kellyValue / totalKellyValue) * tradingStack;
        });

        results.innerHTML = trades
            .map(
                (trade) => `
            <tr>
                <td>${trade.ticker}</td>
                <td>${trade.adjustedTradingSize.toFixed(2)}</td>
            </tr>
        `
            )
            .join('');
    });
});
