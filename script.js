// ... (previous code) ...

function calculate_rr(entry, tp, sl) {
    return Math.abs((tp - entry) / (entry - sl));
}

function kelly_criterion(win_probability, win_loss_ratio) {
    return win_probability - ((1 - win_probability) / win_loss_ratio);
}

document.addEventListener('DOMContentLoaded', () => {
    // ... (previous code) ...

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
            const kellyValue = kelly_criterion(winProbability, rr);

            return { ticker, entry, tp, sl, winProbability, rr, kellyValue };
        });

        const totalKellyValue = trades.reduce((sum, trade) => sum + trade.kellyValue, 0);

        const tradingStack = parseFloat(prompt('Enter your trading stack:'));

        trades.forEach((trade) => {
            trade.adjustedTradingSize = trade.kellyValue * tradingStack / totalKellyValue;
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
