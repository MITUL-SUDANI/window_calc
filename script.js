/**
 * Window Dimension Calculator - Consolidated Script
 * Includes: Math Utils (Base-8), Config Manager, and UI Logic
 */

// --- Global Error Handler ---
window.onerror = function (msg, url, line, col, error) {
    alert("Error: " + msg + "\nLine: " + line + "\nCol: " + col);
    return false;
};

// --- Part 1: Math Utils (Dimension Class) ---
class Dimension {
    constructor(u = 0, s = 0) {
        this.u = parseInt(u) || 0;
        this.s = parseInt(s) || 0;
        this.normalize();
    }

    // Convert current dimension to total subunits (Normal Value)
    toSubunits() {
        return (this.u * 8) + this.s;
    }

    // Update u and s based on a total subunits value
    fromSubunits(total) {
        this.u = Math.floor(total / 8);
        this.s = total - (this.u * 8); // Safer modulo for negatives
    }

    normalize() {
        // Enforce the normal form via total subunits
        const total = this.toSubunits();
        this.fromSubunits(total);
    }

    add(other) {
        const nv1 = this.toSubunits();
        const nv2 = other.toSubunits();
        const resultNv = nv1 + nv2;

        const result = new Dimension();
        result.fromSubunits(resultNv);
        return result;
    }

    subtract(other) {
        const nv1 = this.toSubunits();
        const nv2 = other.toSubunits();
        const resultNv = nv1 - nv2;

        const result = new Dimension();
        result.fromSubunits(resultNv);
        return result;
    }

    toString() {
        return `${this.u} unit ${this.s} sub`;
    }

    static from(u, s) {
        return new Dimension(u, s);
    }
}
window.Dimension = Dimension;

// --- Part 2: Configuration Manager ---
const DEFAULT_CONFIG = {
    "40mm": {
        "2 Track": {
            "Shutter Height": { source: 'H', op: '-', u: 1, s: 5 },
            "Shutter Length": { source: 'L', op: '-', u: 0, s: 6 },
            "Glass Height": { source: 'H', op: '-', u: 2, s: 4 },
            "Glass Length": { source: 'L', op: '+', u: 0, s: 5 }
        },
        "3 Track": {
            "Shutter Height": { source: 'H', op: '-', u: 1, s: 5 },
            "Shutter Length": { source: 'L', op: '-', u: 0, s: 8 },
            "Glass Height": { source: 'H', op: '-', u: 2, s: 4 },
            "Glass Length": { source: 'L', op: '+', u: 0, s: 5 }
        },
        "4 Track": {
            "Shutter Height": { source: 'H', op: '-', u: 1, s: 5 },
            "Shutter Length": { source: 'L', op: '-', u: 4, s: 4 },
            "Glass Height": { source: 'H', op: '-', u: 2, s: 4 },
            "Glass Length": { source: 'L', op: '+', u: 0, s: 5 }
        },
        "2 Track 4 Shutter": {
            "Shutter Height": { source: 'H', op: '-', u: 1, s: 5 },
            "Shutter Length": { source: 'L', op: '-', u: 1, s: 1 },
            "Glass Height": { source: 'H', op: '-', u: 2, s: 4 },
            "Glass Length": { source: 'L', op: '+', u: 0, s: 5 }
        }
    },
    "60mm": {
        "2 Track": {
            "Shutter Height": { source: 'H', op: '-', u: 1, s: 5 },
            "Shutter Length": { source: 'L', op: '+', u: 0, s: 6 },
            "Glass Height": { source: 'H', op: '-', u: 4, s: 0.5 },
            "Glass Length": { source: 'L', op: '-', u: 4, s: 0.5 }
        },
        "3 Track": {
            "Shutter Height": { source: 'H', op: '-', u: 1, s: 5 },
            "Shutter Length": { source: 'L', op: '+', u: 0, s: 0 },
            "Glass Height": { source: 'H', op: '-', u: 4, s: 1 },
            "Glass Length": { source: 'L', op: '-', u: 4, s: 1 }
        },
        "4 Track": {
            "Shutter Height": { source: 'H', op: '-', u: 1, s: 5 },
            "Shutter Length": { source: 'L', op: '+', u: 0, s: 0 },
            "Glass Height": { source: 'H', op: '-', u: 4, s: 1 },
            "Glass Length": { source: 'L', op: '-', u: 4, s: 1 }
        },
        "2 Track 4 Shutter": {
            "Shutter Height": { source: 'H', op: '-', u: 1, s: 5 },
            "Shutter Length": { source: 'L', op: '+', u: 0, s: 0 },
            "Glass Height": { source: 'H', op: '-', u: 4, s: 1 },
            "Glass Length": { source: 'L', op: '-', u: 4, s: 1 }
        }
    },
    "65mm (Domal)": {
        "2 Track": {
            "Shutter Height": { source: 'H', op: '-', u: 2, s: 6 },
            "Shutter Length": { source: 'L', op: '-', u: 0, s: 3 },
            "Glass Height": { source: 'H', op: '-', u: 4, s: 1 },
            "Glass Length": { source: 'L', op: '-', u: 4, s: 1 }
        },
        "3 Track": {
            "Shutter Height": { source: 'H', op: '-', u: 2, s: 6 },
            "Shutter Length": { source: 'L', op: '+', u: 2, s: 2 },
            "Glass Height": { source: 'H', op: '-', u: 4, s: 1 },
            "Glass Length": { source: 'L', op: '-', u: 4, s: 1 }
        },
        "4 Track": {
            "Shutter Height": { source: 'H', op: '-', u: 2, s: 6 },
            "Shutter Length": { source: 'L', op: '+', u: 4, s: 6 },
            "Glass Height": { source: 'H', op: '-', u: 4, s: 1 },
            "Glass Length": { source: 'L', op: '-', u: 4, s: 1 }
        },
        "2 Track 4 Shutter": {
            "Shutter Height": { source: 'H', op: '-', u: 2, s: 6 },
            "Shutter Length": { source: 'L', op: '+', u: 0, s: 0 },
            "Glass Height": { source: 'H', op: '-', u: 4, s: 1 },
            "Glass Length": { source: 'L', op: '-', u: 4, s: 1 }
        }
    },
    "Openable (P - Pipe)": {
        "40mm": {
            "Shutter Height": { source: 'H', op: '-', u: 1, s: 2 },
            "Shutter Length": { source: 'L', op: '-', u: 4, s: 3 },
            "Glass Height": { source: 'H', op: '-', u: 3, s: 4 },
            "Glass Length": { source: 'L', op: '-', u: 0, s: 0 }
        },
        "60mm": {
            "Shutter Height": { source: 'H', op: '-', u: 1, s: 2 },
            "Shutter Length": { source: 'L', op: '-', u: 1, s: 3 },
            "Glass Height": { source: 'H', op: '-', u: 5, s: 5 },
            "Glass Length": { source: 'L', op: '-', u: 5, s: 7 }
        }
    },
    "Openable (R - 40)": {
        "Single Shutter": {
            "Shutter Height": { source: 'H', op: '-', u: 1, s: 2 },
            "Shutter Length": { source: 'L', op: '-', u: 1, s: 5 },
            "Glass Height": { source: 'H', op: '-', u: 0, s: 3 },
            "Glass Length": { source: 'L', op: '-', u: 0, s: 3 }
        },
        "Double Shutter": {
            "Shutter Height": { source: 'H', op: '-', u: 1, s: 2 },
            "Shutter Length": { source: 'L', op: '-', u: 1, s: 7 },
            "Glass Height": { source: 'H', op: '-', u: 0, s: 3 },
            "Glass Length": { source: 'L', op: '-', u: 0, s: 3 }
        }
    }
};

class ConfigManager {
    static getFormulas() {
        // v3 key to ensure we don't pick up old corrupted data
        const saved = localStorage.getItem('windowCalc_formulas_v3');
        if (saved) return JSON.parse(saved);
        return DEFAULT_CONFIG;
    }

    static saveFormulas(formulas) {
        localStorage.setItem('windowCalc_formulas_v3', JSON.stringify(formulas));
    }

    static resetDefaults() {
        localStorage.removeItem('windowCalc_formulas_v3');
        return DEFAULT_CONFIG;
    }
}
window.ConfigManager = ConfigManager;

// --- Part 3: Main UI Logic ---
document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const windowTypeSelect = document.getElementById('windowType');
    const windowSubtypeSelect = document.getElementById('windowSubtype');
    const subtypeGroup = document.getElementById('subtypeGroup');

    const lengthUnit = document.getElementById('lengthUnit');
    const lengthSub = document.getElementById('lengthSub');
    const heightUnit = document.getElementById('heightUnit');
    const heightSub = document.getElementById('heightSub');

    const calculateBtn = document.getElementById('calculateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const errorMessage = document.getElementById('errorMessage');
    const resultsSection = document.getElementById('results');
    const resultsGrid = document.getElementById('resultsGrid');

    // Config Elements
    const openConfigBtn = document.getElementById('openConfigBtn');
    const configModal = document.getElementById('configModal');
    const closeConfigBtn = document.getElementById('closeConfigBtn');
    const configTypeSelect = document.getElementById('configType');
    const formulaTableBody = document.getElementById('formulaTableBody');
    const saveConfigBtn = document.getElementById('saveConfigBtn');

    // State
    let currentConfig = ConfigManager.getFormulas();

    // Init
    initSubunitSelects();
    populateTypeSelect(windowTypeSelect);
    populateTypeSelect(configTypeSelect);
    configModal.hidden = true;

    function initSubunitSelects() {
        const selects = [lengthSub, heightSub];
        selects.forEach(sel => {
            sel.innerHTML = '';
            for (let i = 0; i < 8; i++) {
                const opt = document.createElement('option');
                opt.value = i;
                opt.textContent = i;
                sel.appendChild(opt);
            }
            sel.value = 0;
        });
    }

    function populateTypeSelect(selectElement) {
        selectElement.innerHTML = '';
        const types = Object.keys(currentConfig);
        types.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            selectElement.appendChild(option);
        });

        if (types.length > 0) {
            selectElement.value = types[0];
            if (selectElement === windowTypeSelect) {
                handleTypeChangeCalc(selectElement);
            } else {
                // If config modal is open/will open, this will be handled there
            }
        }
    }

    function handleTypeChangeCalc(selectElement) {
        const selectedType = selectElement.value;
        const subtypes = currentConfig[selectedType] ? Object.keys(currentConfig[selectedType]) : [];

        windowSubtypeSelect.innerHTML = '';
        subtypes.forEach(subtype => {
            const option = document.createElement('option');
            option.value = subtype;
            option.textContent = subtype;
            windowSubtypeSelect.appendChild(option);
        });

        const hasSubtypes = subtypes.length > 0;
        subtypeGroup.hidden = !hasSubtypes;

        // Make type full-width when no subtype exists
        const typeRow = selectElement.closest('.input-row');
        if (typeRow) typeRow.classList.toggle('single-col', !hasSubtypes);
    }

    windowTypeSelect.addEventListener('change', () => handleTypeChangeCalc(windowTypeSelect));

    function calculate() {
        errorMessage.hidden = true;
        resultsSection.hidden = true;
        resultsGrid.innerHTML = '';

        const type = windowTypeSelect.value;
        const subtype = windowSubtypeSelect.value;

        if (!currentConfig[type] || !currentConfig[type][subtype]) {
            showError("Invalid Window configuration selected.");
            return;
        }

        const lUnit = parseInt(lengthUnit.value) || 0;
        const lSub = parseInt(lengthSub.value) || 0;
        const hUnit = parseInt(heightUnit.value) || 0;
        const hSub = parseInt(heightSub.value) || 0;

        const L = new Dimension(lUnit, lSub);
        const H = new Dimension(hUnit, hSub);

        const formulas = currentConfig[type][subtype];

        const categories = {
            "Shutter": [],
            "Glass": [],
            "Frame": [],
            "Other": []
        };



        for (const [key, rule] of Object.entries(formulas)) {
            let val = (rule.source === 'L') ? L : H;
            const delta = new Dimension(rule.u, rule.s);

            let result;
            if (rule.op === '+') result = val.add(delta);
            else result = val.subtract(delta);

            const keyLower = key.toLowerCase();
            let cat = 'Other';
            if (keyLower.includes('shutter')) cat = 'Shutter';
            else if (keyLower.includes('glass')) cat = 'Glass';
            else if (keyLower.includes('frame')) cat = 'Frame';

            // Check for negative result (Not Possible)
            let displayVal = result.toString();
            let isError = false;

            if (result.toSubunits() < 0) {
                displayVal = "Not Possible";
                isError = true;
            }

            // Build formula hint e.g. "- 1u 5s"
            const formulaHint = `${rule.op} ${rule.u}u ${rule.s}s`;

            categories[cat].push({ label: key, value: displayVal, isError: isError, hint: formulaHint });


        }



        for (const [catName, items] of Object.entries(categories)) {
            if (items.length === 0) continue;
            const card = document.createElement('div');
            card.className = 'result-card';
            const title = document.createElement('h3');
            title.textContent = `${catName} Dimensions`;
            card.appendChild(title);
            items.forEach(item => {
                const row = document.createElement('div');
                row.className = 'result-row';
                const valClass = item.isError ? 'result-value error-text' : 'result-value';
                row.innerHTML = `
                    <span class="result-label">
                        ${item.label}
                        <span class="formula-hint">${item.hint}</span>
                    </span>
                    <span class="${valClass}">${item.value}</span>
                `;
                card.appendChild(row);
            });
            resultsGrid.appendChild(card);
        }

        resultsSection.hidden = false;
        toggleInputs(true); // Lock inputs after calculation

        if (window.innerWidth < 600) {
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    function toggleInputs(disabled) {
        const inputs = [
            windowTypeSelect, windowSubtypeSelect,
            lengthUnit, lengthSub, heightUnit, heightSub,
            calculateBtn
        ];
        inputs.forEach(el => el.disabled = disabled);
    }

    function clearApp() {
        errorMessage.hidden = true;
        resultsSection.hidden = true;
        resultsGrid.innerHTML = '';

        // Reset inputs
        lengthUnit.value = '';
        heightUnit.value = '';
        lengthSub.value = 0;
        heightSub.value = 0;

        toggleInputs(false); // Unlock inputs
    }

    function showError(msg) {
        errorMessage.textContent = msg;
        errorMessage.hidden = false;
    }

    calculateBtn.addEventListener('click', calculate);
    clearBtn.addEventListener('click', clearApp);

    // --- Config Logic ---
    const columns = [
        { label: "Shutter Height", key: "Shutter Height", source: 'H' },
        { label: "Shutter Length", key: "Shutter Length", source: 'L' },
        { label: "Glass Height", key: "Glass Height", source: 'H' },
        { label: "Glass Length", key: "Glass Length", source: 'L' }
    ];

    configTypeSelect.addEventListener('change', renderFormulaTable);

    openConfigBtn.addEventListener('click', (e) => {
        e.preventDefault();
        configModal.hidden = false;
        configTypeSelect.value = windowTypeSelect.value;
        renderFormulaTable();
    });

    closeConfigBtn.addEventListener('click', (e) => {
        e.preventDefault();
        configModal.hidden = true;
    });

    window.addEventListener('click', (e) => {
        if (e.target === configModal) configModal.hidden = true;
    });

    function renderFormulaTable() {
        formulaTableBody.innerHTML = '';
        const type = configTypeSelect.value;
        if (!currentConfig[type]) return;

        const subtypes = Object.keys(currentConfig[type]);

        subtypes.forEach(subtype => {
            const tr = document.createElement('tr');

            const tdName = document.createElement('td');
            tdName.textContent = subtype;
            tdName.style.fontWeight = 'bold';
            tr.appendChild(tdName);

            columns.forEach(col => {
                const td = document.createElement('td');
                let rule = currentConfig[type][subtype][col.key];
                if (!rule) rule = { op: '-', u: 0, s: 0, source: col.source };

                td.innerHTML = `
                    <div class="cell-input-group" data-subtype="${subtype}" data-key="${col.key}" data-source="${col.source}">
                        <select class="cell-op">
                            <option value="-" ${rule.op === '-' ? 'selected' : ''}>-</option>
                            <option value="+" ${rule.op === '+' ? 'selected' : ''}>+</option>
                        </select>
                        <input type="number" class="cell-u" value="${rule.u}" min="0">
                        <select class="cell-s">
                             ${generateSubunitOptions(rule.s)}
                        </select>
                    </div>
                `;
                tr.appendChild(td);
            });
            formulaTableBody.appendChild(tr);
        });
    }

    function generateSubunitOptions(selectedVal) {
        let html = '';
        const intVal = Math.round(selectedVal || 0);
        for (let i = 0; i < 8; i++) {
            html += `<option value="${i}" ${i === intVal ? 'selected' : ''}>${i}</option>`;
        }
        return html;
    }

    saveConfigBtn.addEventListener('click', () => {
        const type = configTypeSelect.value;
        const rows = formulaTableBody.querySelectorAll('tr');

        rows.forEach(tr => {
            const inputs = tr.querySelectorAll('.cell-input-group');
            if (inputs.length === 0) return;
            const subtype = inputs[0].dataset.subtype;

            if (!currentConfig[type][subtype]) currentConfig[type][subtype] = {};

            inputs.forEach(group => {
                const key = group.dataset.key;
                const source = group.dataset.source;
                const op = group.querySelector('.cell-op').value;
                const u = parseInt(group.querySelector('.cell-u').value) || 0;
                const s = parseInt(group.querySelector('.cell-s').value) || 0;

                currentConfig[type][subtype][key] = { source, op, u, s };
            });
        });

        ConfigManager.saveFormulas(currentConfig);
        alert('Formulas saved successfully!');
        configModal.hidden = true;
        handleTypeChangeCalc(windowTypeSelect);
    });



});
