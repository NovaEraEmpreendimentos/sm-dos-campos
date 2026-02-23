// Tabela de taxas atualizada com 19x, 20x e 21x
const taxas = {
    1: 7.00, 2: 8.00, 3: 9.00, 4: 10.00, 5: 10.30, 6: 10.90,
    7: 11.00, 8: 12.00, 9: 12.30, 10: 14.00, 11: 16.00, 12: 17.00,
    13: 18.00, 14: 19.00, 15: 20.00, 16: 20.30, 17: 20.90, 18: 21.00,
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
const closeModal = document.querySelector('.close');

let currentSimulation = null;

document.addEventListener('DOMContentLoaded', function() {
    initInstallments();
    updateTable();
    setupEventListeners();
});

function initInstallments() {
    installmentsSelect.innerHTML = '';
    Object.keys(taxas).forEach(num => {
        const option = document.createElement('option');
        option.value = num;
        option.textContent = `${num}x`;
        installmentsSelect.appendChild(option);
    });
}

function setupEventListeners() {
    loanAmountInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = (value / 100).toFixed(2);
        e.target.value = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(value);
        updateTable();
    });

    generatePrintBtn.addEventListener('click', showPrintModal);
    closeModal.onclick = () => printModal.style.display = 'none';
    closePrintBtn.onclick = () => printModal.style.display = 'none';
    window.onclick = (event) => { if (event.target == printModal) printModal.style.display = 'none'; };
    downloadPrintBtn.addEventListener('click', generatePDF);
}

function getRawValue(value) {
    if (!value) return 0;
    return parseFloat(value.replace(/\./g, '').replace(',', '.'));
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function updateTable() {
    const amount = getRawValue(loanAmountInput.value) || 0;
    tableBody.innerHTML = '';
    
    Object.keys(taxas).forEach(num => {
        const rate = taxas[num];
        const valorCobrar = amount / (1 - (rate / 100));
        const parcelaCobrar = valorCobrar / num;
        const parcelaReceber = amount / num;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${num}x</td>
            <td>${rate.toFixed(2)}%</td>
            <td>${formatCurrency(amount)}</td>
            <td>${formatCurrency(parcelaReceber)}</td>
            <td class="highlight">${formatCurrency(valorCobrar)}</td>
            <td class="highlight">${formatCurrency(parcelaCobrar)}</td>
        `;
        tableBody.appendChild(row);
    });
}

function showPrintModal() {
    const amount = getRawValue(loanAmountInput.value);
    if (!amount || amount <= 0) {
        alert('Por favor, insira um valor válido.');
        return;
    }

    const num = installmentsSelect.value;
    const rate = taxas[num];
    const valorCobrar = amount / (1 - (rate / 100));
    const parcelaCobrar = valorCobrar / num;

    currentSimulation = {
        amount, num, rate, valorCobrar, parcelaCobrar,
        date: new Date().toLocaleDateString('pt-BR'),
        time: new Date().toLocaleTimeString('pt-BR')
    };

    printContent.innerHTML = `
        <div class="print-header">
            <div class="print-logo" style="font-size: 24px; font-weight: bold; color: #1e3a8a;">Gilliard Cred</div>
            <div class="print-subtitle">( serviços e soluções financeiras )</div>
        </div>
        <div class="print-body">
            <div class="print-info-grid">
                <div class="print-item"><span>Data:</span> <strong>${currentSimulation.date}</strong></div>
                <div class="print-item"><span>Valor Solicitado:</span> <strong>${formatCurrency(amount)}</strong></div>
                <div class="print-item"><span>Plano:</span> <strong>${num} parcelas</strong></div>
            </div>
            <div class="print-highlight" style="background: #dcfce7; padding: 15px; border-radius: 8px; margin-top: 15px;">
                <div class="print-item"><span>VALOR DA PARCELA:</span> <strong>${formatCurrency(parcelaCobrar)}</strong></div>
                <div class="print-item"><span>VALOR TOTAL:</span> <strong>${formatCurrency(valorCobrar)}</strong></div>
            </div>
        </div>
        <div class="print-contact" style="text-align: center; margin-top: 20px; font-size: 13px;">
            <p><strong>Instagram: @gilliardcred</strong></p>
            <p>Telefone: (82) 9 9331-2300</p>
            <p>R. Dr. Rômulo de almeida 144, Vizinho a Magazine Luiza</p>
            <p>São Miguel dos Campos - AL</p>
        </div>
    `;
    printModal.style.display = 'block';
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(30, 58, 138);
    doc.text("Gilliard Cred", 105, 30, { align: "center" });
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("( serviços e soluções financeiras )", 105, 38, { align: "center" });
    
    doc.line(20, 45, 190, 45);
    doc.text(`Data: ${currentSimulation.date} - Valor: ${formatCurrency(currentSimulation.amount)}`, 20, 60);
    doc.text(`Plano escolhido: ${currentSimulation.num} parcelas`, 20, 70);
    
    doc.setFillColor(220, 252, 231);
    doc.rect(20, 80, 170, 25, 'F');
    doc.text(`VALOR DA PARCELA: ${formatCurrency(currentSimulation.parcelaCobrar)}`, 105, 90, { align: "center" });
    doc.text(`TOTAL A PAGAR: ${formatCurrency(currentSimulation.valorCobrar)}`, 105, 100, { align: "center" });

    doc.setFontSize(10);
    doc.text("Instagram: @gilliardcred | WhatsApp: (82) 9 9331-2300", 105, 130, { align: "center" });
    doc.text("Endereço: R. Dr. Rômulo de almeida 144, São Miguel dos Campos - AL", 105, 136, { align: "center" });

    doc.save(`Simulacao_GilliardCred.pdf`);
}
