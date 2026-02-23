// Tabela de taxas
const taxas = {
    1: 7.00, 2: 8.00, 3: 9.00, 4: 10.00, 5: 10.30, 6: 10.90,
    7: 11.00, 8: 12.00, 9: 12.30, 10: 14.00, 11: 16.00,
    12: 17.00, 13: 18.00, 14: 19.00, 15: 20.00,
    16: 20.30, 17: 20.90, 18: 21.00
};

const loanAmountInput = document.getElementById('loanAmount');
const installmentsSelect = document.getElementById('installments');
const generatePrintBtn = document.getElementById('generatePrint');
const tableBody = document.getElementById('tableBody');
const printModal = document.getElementById('printModal');
const printContent = document.getElementById('printContent');
const downloadPrintBtn = document.getElementById('downloadPrint');
const closePrintBtn = document.getElementById('closePrint');
const closeModal = document.querySelector('.close');

let currentSimulation = null;

document.addEventListener('DOMContentLoaded', function() {
    updateTable();
    setupEventListeners();
});

function setupEventListeners() {
    loanAmountInput.addEventListener('input', updateTable);
    installmentsSelect.addEventListener('change', updateTable);
    generatePrintBtn.addEventListener('click', generatePrint);
    downloadPrintBtn.addEventListener('click', downloadPrint);
    closePrintBtn.addEventListener('click', () => printModal.style.display = 'none');
    closeModal.addEventListener('click', () => printModal.style.display = 'none');
}

function calculateValues(loanAmount, parcelas, taxa) {
    const taxaDecimal = taxa / 100;

    const valorCobrar = loanAmount * (1 + taxaDecimal);
    const parcelaCobrar = valorCobrar / parcelas;

    const valorReceber = loanAmount * (1 - taxaDecimal);
    const parcelaReceber = valorReceber / parcelas;

    return { valorReceber, parcelaReceber, valorCobrar, parcelaCobrar };
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function updateTable() {
    const loanAmount = parseFloat(loanAmountInput.value) || 0;
    tableBody.innerHTML = '';

    for (let parcelas = 1; parcelas <= 18; parcelas++) {
        const taxa = taxas[parcelas];
        const row = document.createElement('tr');

        if (loanAmount > 0) {
            const valores = calculateValues(loanAmount, parcelas, taxa);
            row.innerHTML = `
                <td><strong>${parcelas}x</strong></td>
                <td>${taxa.toFixed(2)}%</td>
                <td>${formatCurrency(valores.valorReceber)}</td>
                <td>${formatCurrency(valores.parcelaReceber)}</td>
                <td>${formatCurrency(valores.valorCobrar)}</td>
                <td>${formatCurrency(valores.parcelaCobrar)}</td>
            `;
        } else {
            row.innerHTML = `
                <td><strong>${parcelas}x</strong></td>
                <td>${taxa.toFixed(2)}%</td>
                <td>-</td><td>-</td><td>-</td><td>-</td>
            `;
        }

        tableBody.appendChild(row);
    }
}

function generatePrint() {
    const loanAmount = parseFloat(loanAmountInput.value);
    const installments = parseInt(installmentsSelect.value);

    if (!loanAmount || !installments) {
        alert('Preencha o valor e selecione as parcelas.');
        return;
    }

    const taxa = taxas[installments];
    const valores = calculateValues(loanAmount, installments, taxa);

    currentSimulation = { loanAmount, installments, taxa, valores };

    generatePrintContent();
    printModal.style.display = 'block';
}

function generatePrintContent() {
    const sim = currentSimulation;

    printContent.innerHTML = `
        <div class="print-header">
            <div class="print-title">Gilliard Cred</div>
            <div class="print-subtitle">Serviços e Soluções Financeiras</div>
        </div>

        <div class="print-section">
            <h3>Simulação</h3>
            <p><strong>Valor:</strong> ${formatCurrency(sim.loanAmount)}</p>
            <p><strong>Você recebe:</strong> ${formatCurrency(sim.valores.valorReceber)}</p>
            <p><strong>Parcelas:</strong> ${sim.installments}x ${formatCurrency(sim.valores.parcelaCobrar)}</p>
        </div>

        <div class="print-contact">
            <p>Telefone: (82) 9 9331-2300</p>
            <p>Instagram: @gilliardcred</p>
            <p>R. Dr. Rômulo de Almeida, 144</p>
            <p>Vizinho a Magazine Luiza</p>
            <p>São Miguel dos Campos - AL</p>
        </div>
    `;
}

function downloadPrint() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');

    const sim = currentSimulation;
    const pageWidth = pdf.internal.pageSize.getWidth();
    let y = 20;

    pdf.setFontSize(18);
    pdf.text('Gilliard Cred', pageWidth / 2, y, { align: 'center' });
    y += 8;

    pdf.setFontSize(12);
    pdf.text('Serviços e Soluções Financeiras', pageWidth / 2, y, { align: 'center' });
    y += 15;

    pdf.setFontSize(14);
    pdf.text(`Valor: ${formatCurrency(sim.loanAmount)}`, 20, y);
    y += 8;

    pdf.text(`Você recebe: ${formatCurrency(sim.valores.valorReceber)}`, 20, y);
    y += 8;

    pdf.text(`Parcelas: ${sim.installments}x ${formatCurrency(sim.valores.parcelaCobrar)}`, 20, y);
    y += 20;

    pdf.setFontSize(10);
    pdf.text('Telefone: (82) 9 9331-2300', pageWidth / 2, y, { align: 'center' });
    y += 6;
    pdf.text('Instagram: @gilliardcred', pageWidth / 2, y, { align: 'center' });
    y += 6;
    pdf.text('R. Dr. Rômulo de Almeida, 144', pageWidth / 2, y, { align: 'center' });
    y += 6;
    pdf.text('Vizinho a Magazine Luiza', pageWidth / 2, y, { align: 'center' });
    y += 6;
    pdf.text('São Miguel dos Campos - AL', pageWidth / 2, y, { align: 'center' });

    pdf.save(`simulacao-gilliard-cred.pdf`);
}