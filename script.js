const taxas = {
    1: 10.50, 2: 11.16, 3: 11.63, 4: 12.19, 5: 12.75, 6: 13.22,
    7: 13.97, 8: 14.44, 9: 14.72, 10: 15.25, 11: 16.03, 12: 16.58,
    13: 19.40, 14: 19.87, 15: 20.34, 16: 20.81, 17: 21.28, 18: 21.75,
    19: 23.00, 20: 24.00, 21: 25.00
};

const loanAmountInput = document.getElementById('loanAmount');
const installmentsSelect = document.getElementById('installments');
const generatePrintBtn = document.getElementById('generatePrint');
const tableBody = document.getElementById('tableBody');
const printModal = document.getElementById('printModal');
const printContent = document.getElementById('printContent');
const downloadPrintBtn = document.getElementById('downloadPrint');
const closePrintBtn = document.getElementById('closePrint');
const closeModalSpan = document.querySelector('.close');

document.addEventListener('DOMContentLoaded', () => {
    initInstallments();
    updateTable();
    setupEventListeners();
});

function initInstallments() {
    for (let i = 1; i <= 21; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i}x`;
        installmentsSelect.appendChild(option);
    }
    installmentsSelect.value = 1;
}

function setupEventListeners() {
    loanAmountInput.addEventListener('input', updateTable);
    installmentsSelect.addEventListener('change', updateTable);
    generatePrintBtn.addEventListener('click', showPrintModal);
    downloadPrintBtn.addEventListener('click', generatePDF);
    closePrintBtn.addEventListener('click', () => printModal.style.display = 'none');
    closeModalSpan.addEventListener('click', () => printModal.style.display = 'none');
    window.onclick = (event) => { if (event.target == printModal) printModal.style.display = 'none'; };
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function updateTable() {
    const amount = parseFloat(loanAmountInput.value) || 0;
    tableBody.innerHTML = '';

    for (let i = 1; i <= 21; i++) {
        const taxa = taxas[i];
        const valorReceberSePassarX = amount * (1 - taxa / 100);
        const valorCobrarParaReceberX = amount / (1 - taxa / 100);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i}x</td>
            <td>${taxa.toFixed(2)}%</td>
            <td class="highlight">${formatCurrency(valorReceberSePassarX)}</td>
            <td>${formatCurrency(amount / i)}</td>
            <td class="highlight">${formatCurrency(valorCobrarParaReceberX)}</td>
            <td>${formatCurrency(valorCobrarParaReceberX / i)}</td>
        `;
        tableBody.appendChild(row);
    }
}

function showPrintModal() {
    const amount = parseFloat(loanAmountInput.value) || 0;
    const num = parseInt(installmentsSelect.value);
    const taxa = taxas[num];
    const valorReceberSePassarX = amount * (1 - taxa / 100);
    const valorCobrarParaReceberX = amount / (1 - taxa / 100);

    printContent.innerHTML = `
        <div style="font-family: Arial; border: 1px solid #ccc; padding: 15px; border-radius: 10px;">
            <h2 style="text-align: center; color: #1e40af;">Gilliard Cred</h2>
            <hr>
            <p><b>Simulação de Crédito</b></p>
            <p>Data: ${new Date().toLocaleDateString('pt-BR')}</p>
            <div style="background: #f3f4f6; padding: 10px; margin: 10px 0; border-radius: 5px;">
                <p>SE VOCÊ PASSAR: <b>${formatCurrency(amount)}</b></p>
                <p>VOCÊ RECEBE: <b>${formatCurrency(valorReceberSePassarX)}</b></p>
                <p>EM ${num}x DE ${formatCurrency(amount/num)}</p>
            </div>
            <div style="background: #f3f4f6; padding: 10px; margin: 10px 0; border-radius: 5px;">
                <p>SE VOCÊ QUER RECEBER: <b>${formatCurrency(amount)}</b></p>
                <p>VOCÊ PASSA: <b>${formatCurrency(valorCobrarParaReceberX)}</b></p>
                <p>EM ${num}x DE ${formatCurrency(valorCobrarParaReceberX/num)}</p>
            </div>
            <p style="text-align: center; font-size: 11px;">(82) 9 9330-1661 | São Miguel dos Campos - AL</p>
        </div>
    `;
    printModal.style.display = 'block';
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'pt', 'a4');
    const content = document.getElementById('printContent');
    
    doc.html(content, {
        callback: function (doc) { doc.save('simulacao.pdf'); },
        x: 40, y: 40, width: 500, windowWidth: 600
    });
}
