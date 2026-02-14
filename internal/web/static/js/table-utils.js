// Apply financial table formatting with profit/loss coloring
export function applyFinancialTableFormatting(options = {}) {
    const {
        selector = '.financial-table',
        excludeColumns = [],
        absoluteValueColumns = [],
        skipFirstColumn = true
    } = options;
    
    const table = document.querySelector(selector);
    if (!table) return;
    
    const rows = table.querySelectorAll('tbody tr, tfoot tr');
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        cells.forEach((cell, columnIndex) => {
            // Skip excluded columns
            if (excludeColumns.includes(columnIndex)) return;
            if (skipFirstColumn && columnIndex === 0) return;
            const text = cell.textContent.trim();
            // Check if it's a monetary value (with or without decimal places)
            if (text.match(/^-?\$[\d,]*\.?\d*$/)) {
                const value = parseFloat(text.replace(/[\$,]/g, ''));
                if (isNaN(value)) return;
                const formattedValue = '$' + Math.round(Math.abs(value)).toLocaleString();
                // Absolute value columns - no profit/loss coloring
                if (absoluteValueColumns.includes(columnIndex)) {
                    if (window.DOMPurify) {
                        cell.innerHTML = window.DOMPurify.sanitize(formattedValue);
                    } else {
                        cell.textContent = formattedValue;
                    }
                } else {
                    // Apply profit/loss coloring
                    if (value < 0) {
                        if (window.DOMPurify) {
                            cell.innerHTML = window.DOMPurify.sanitize('<span class="negative">-' + formattedValue + '</span>');
                        } else {
                            cell.textContent = '-' + formattedValue;
                            cell.classList.add('negative');
                        }
                    } else if (value > 0) {
                        if (window.DOMPurify) {
                            cell.innerHTML = window.DOMPurify.sanitize('<span class="positive">' + formattedValue + '</span>');
                        } else {
                            cell.textContent = formattedValue;
                            cell.classList.add('positive');
                        }
                    } else {
                        if (window.DOMPurify) {
                            cell.innerHTML = window.DOMPurify.sanitize(formattedValue);
                        } else {
                            cell.textContent = formattedValue;
                        }
                    }
                }
            }
            // Check if it's a percentage value
            else if (text.match(/^-?[\d,]+\.\d{2}%$/)) {
                const value = parseFloat(text.replace(/[%,]/g, ''));
                // Apply coloring: negative percentages are red, positive are green
                if (value < 0) {
                    if (window.DOMPurify) {
                        cell.innerHTML = window.DOMPurify.sanitize('<span class="negative">' + text + '</span>');
                    } else {
                        cell.textContent = text;
                        cell.classList.add('negative');
                    }
                } else if (value > 0) {
                    if (window.DOMPurify) {
                        cell.innerHTML = window.DOMPurify.sanitize('<span class="positive">' + text + '</span>');
                    } else {
                        cell.textContent = text;
                        cell.classList.add('positive');
                    }
                }
            }
        });
    });
}

// Apply formatting to watchlist table (Dashboard)
export function applyWatchlistTableColoring() {
    applyFinancialTableFormatting({
        selector: '.financial-table',
        absoluteValueColumns: [1, 2, 3], // Long, Put Exposed, Optionable
        skipFirstColumn: true
    });
}

// Apply formatting to monthly table
export function applyMonthlyTableFormatting() {
    applyFinancialTableFormatting({
        selector: '.financial-table',
        absoluteValueColumns: [],
        skipFirstColumn: true
    });
}
