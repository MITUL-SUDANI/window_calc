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

    divide(divisor) {
        if (divisor <= 0) return this;
        const total = this.toSubunits();
        const resultNv = Math.floor(total / divisor);
        const result = new Dimension();
        result.fromSubunits(resultNv);
        return result;
    }

    toString() {
        return `${this.u}u ${this.s}s`;
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
            "Handle (H)": { source: 'TH', op: '-', u: 1, s: 4, div: 1 },
            "Bearing Pati (B)": { source: 'TL', op: '-', u: 6, s: 4, div: 2 },
            "Glass Height (GH)": { source: 'TH', op: '-', u: 4, s: 0, div: 1 },
            "Glass Length (GL)": { source: 'B', op: '+', u: 0, s: 5, div: 1 }
        },
        "3 Track": {
            "Handle (H)": { source: 'TH', op: '-', u: 1, s: 4, div: 1 },
            "Bearing Pati (B)": { source: 'TL', op: '-', u: 8, s: 0, div: 3 },
            "Glass Height (GH)": { source: 'TH', op: '-', u: 4, s: 0, div: 1 },
            "Glass Length (GL)": { source: 'B', op: '+', u: 0, s: 5, div: 1 }
        }
    },
    "60mm": {
        "2 Track": {
            "Handle (H)": { source: 'TH', op: '-', u: 1, s: 4, div: 1 },
            "Bearing Pati (B)": { source: 'TL', op: '+', u: 0, s: 6, div: 2 },
            "Glass Height (GH)": { source: 'TH', op: '-', u: 4, s: 1, div: 1 },
            "Glass Length (GL)": { source: 'B', op: '-', u: 4, s: 1, div: 1 }
        },
        "3 Track": {
            "Handle (H)": { source: 'TH', op: '-', u: 1, s: 4, div: 1 },
            "Bearing Pati (B)": { source: 'TL', op: '+', u: 2, s: 6, div: 3 },
            "Glass Height (GH)": { source: 'TH', op: '-', u: 4, s: 1, div: 1 },
            "Glass Length (GL)": { source: 'B', op: '-', u: 4, s: 1, div: 1 }
        },
        "4 Track": {
            "Handle (H)": { source: 'TH', op: '-', u: 1, s: 4, div: 1 },
            "Bearing Pati (B)": { source: 'TL', op: '+', u: 5, s: 0, div: 4 },
            "Glass Height (GH)": { source: 'TH', op: '-', u: 4, s: 1, div: 1 },
            "Glass Length (GL)": { source: 'B', op: '-', u: 4, s: 1, div: 1 }
        }
    },
    "65mm": {
        "2 Track": {
            "Handle (H)": { source: 'TH', op: '-', u: 2, s: 6, div: 1 },
            "Bearing Pati (B)": { source: 'TL', op: '-', u: 0, s: 4, div: 2 },
            "Glass Height (GH)": { source: 'TH', op: '-', u: 4, s: 1, div: 1 },
            "Glass Length (GL)": { source: 'B', op: '-', u: 4, s: 1, div: 1 }
        },
        "3 Track": {
            "Handle (H)": { source: 'TH', op: '-', u: 2, s: 6, div: 1 },
            "Bearing Pati (B)": { source: 'TL', op: '+', u: 2, s: 0, div: 3 },
            "Glass Height (GH)": { source: 'TH', op: '-', u: 4, s: 1, div: 1 },
            "Glass Length (GL)": { source: 'B', op: '-', u: 4, s: 1, div: 1 }
        }
    }
};

class ConfigManager {
    static getFormulas() {
        // Bump to v4 to force new client-requested 4-step structure
        const saved = localStorage.getItem('windowCalc_formulas_v5');
        if (saved) return JSON.parse(saved);
        return DEFAULT_CONFIG;
    }

    static saveFormulas(formulas) {
        localStorage.setItem('windowCalc_formulas_v5', JSON.stringify(formulas));
    }

    static resetDefaults() {
        localStorage.removeItem('windowCalc_formulas_v5');
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
        const type = windowTypeSelect.value;
        const sub = windowSubtypeSelect.value;
        const formulas = currentConfig[type][sub];

        const TL = new Dimension(lengthUnit.value, lengthSub.value);
        const TH = new Dimension(heightUnit.value, heightSub.value);

        if (isNaN(TL.u) || isNaN(TH.u)) {
            showError("Please enter valid units.");
            return;
        }

        const resultsTableBody = document.getElementById('resultsTableBody');
        resultsTableBody.innerHTML = '';
        const resultsMap = {};

        // Mapping keys to table columns
        const keys = [
            { key: "Bearing Pati (B)", col: "B" },
            { key: "Handle (H)", col: "H" },
            { key: "Glass Height (GH)", col: "H(G)" },
            { key: "Glass Length (GL)", col: "W(G)" }
        ];

        keys.forEach(item => {
            const rule = formulas[item.key];
            if (!rule) return;

            let base;
            if (rule.source === 'TH') base = TH;
            else if (rule.source === 'TL') base = TL;
            else if (rule.source === 'B') base = resultsMap["Bearing Pati (B)"] || new Dimension(0, 0);
            else base = TL;

            const delta = new Dimension(rule.u, rule.s);
            let res;
            if (rule.op === '+') res = base.add(delta);
            else res = base.subtract(delta);

            if (rule.div && rule.div > 1) {
                res = res.divide(rule.div);
            }
            resultsMap[item.key] = res;
        });

        // Create the row
        const tr = document.createElement('tr');

        // NAME Cell
        const tdName = document.createElement('td');
        tdName.className = 'result-name-cell';
        tdName.innerHTML = `${type}<br>${sub}`;
        tr.appendChild(tdName);

        // Data Cells
        keys.forEach(item => {
            const val = resultsMap[item.key];
            const td = document.createElement('td');
            if (val.toSubunits() < 0) {
                td.textContent = "N/A";
                td.classList.add('error-text');
            } else {
                td.textContent = `${val.u}.${val.s}`;
            }
            tr.appendChild(td);
        });

        resultsTableBody.appendChild(tr);
        resultsSection.hidden = false;
        toggleInputs(true);

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
        const resultsTableBody = document.getElementById('resultsTableBody');
        if (resultsTableBody) resultsTableBody.innerHTML = '';

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
        { label: "Handle (H)", key: "Handle (H)", source: 'TH' },
        { label: "Bearing Pati (B)", key: "Bearing Pati (B)", source: 'TL' },
        { label: "Glass Height (GH)", key: "Glass Height (GH)", source: 'TH' },
        { label: "Glass Length (GL)", key: "Glass Length (GL)", source: 'B' }
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
                    <div class="cell-input-group" data-subtype="${subtype}" data-key="${col.key}">
                        <select class="cell-source">
                             <option value="TL" ${rule.source === 'TL' ? 'selected' : ''}>TL</option>
                             <option value="TH" ${rule.source === 'TH' ? 'selected' : ''}>TH</option>
                             <option value="B" ${rule.source === 'B' ? 'selected' : ''}>B</option>
                        </select>
                        <select class="cell-op">
                            <option value="-" ${rule.op === '-' ? 'selected' : ''}>-</option>
                            <option value="+" ${rule.op === '+' ? 'selected' : ''}>+</option>
                        </select>
                        <input type="number" class="cell-u" value="${rule.u}" min="0">
                        <select class="cell-s">
                             ${generateSubunitOptions(rule.s)}
                        </select>
                        <div class="div-wrap">/ <input type="number" class="cell-div" value="${rule.div || 1}" min="1"></div>
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
                const source = group.querySelector('.cell-source').value;
                const op = group.querySelector('.cell-op').value;
                const u = parseInt(group.querySelector('.cell-u').value) || 0;
                const s = parseInt(group.querySelector('.cell-s').value) || 0;
                const div = parseInt(group.querySelector('.cell-div').value) || 1;

                currentConfig[type][subtype][key] = { source, op, u, s, div };
            });
        });

        ConfigManager.saveFormulas(currentConfig);
        alert('Formulas saved successfully!');
        configModal.hidden = true;
        handleTypeChangeCalc(windowTypeSelect);
    });



});
