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

        // Add your JavaScript code for calculations here

        // Example:
        // results.innerHTML = `
        //     <tr>
        //         <td>Ticker</td>
        //         <td>Adjusted Trading Size</td>
        //     </tr>
        // `;
    });
});
