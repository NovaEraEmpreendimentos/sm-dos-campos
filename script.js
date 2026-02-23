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

document.addEventListener('DOMContentLoaded', () => {
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
        if (value === '') { e.target.value = ''; updateTable(); return; }
        value = (value / 100).toFixed(2);
        e.target.value = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(value);
        updateTable();
    });

    generatePrintBtn.addEventListener('click', showPrintModal);
    document.querySelector('.close').onclick = () => printModal.style.display = 'none';
    document.getElementById('closePrint').onclick = () => printModal.style.display = 'none';
    downloadPrintBtn.addEventListener('click', generatePDF);
}

function getRawValue(value) {
    return value ? parseFloat(value.replace(/\./g, '').replace(',', '.')) : 0;
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
        row = document.createElement('tr');
        row.innerHTML = `
            <td>${num}x</td><td>${rate.toFixed(2)}%</td>
            <td>${formatCurrency(amount)}</td><td>${formatCurrency(amount/num)}</td>
            <td class="highlight">${formatCurrency(valorCobrar)}</td>
            <td class="highlight">${formatCurrency(valorCobrar/num)}</td>
        `;
        tableBody.appendChild(row);
    });
}

function showPrintModal() {
    const amount = getRawValue(loanAmountInput.value);
    if (!amount || amount <= 0) { alert('Por favor, insira um valor.'); return; }

    const num = installmentsSelect.value;
    const rate = taxas[num];
    const valorCobrarParaReceberX = amount / (1 - (rate / 100));
    const valorReceberSePassarX = amount * (1 - (rate / 100));

    printContent.innerHTML = `
        <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; font-weight: bold; color: #000;">
            <div style="font-size: 24px;">Gilliard Cred</div>
            <div style="font-size: 14px;">( serviços e soluções financeiras )</div>
        </div>
        <div style="padding: 20px 0; font-weight: bold; line-height: 1.6; color: #000;">
            <p style="margin-bottom: 10px;">DATA: ${new Date().toLocaleDateString('pt-BR')}</p>
            <div style="border: 1px solid #000; padding: 10px; margin-bottom: 10px; border-radius: 5px;">
                <p>SE VOCÊ PASSAR: ${formatCurrency(amount)}</p>
                <p>VOCÊ RECEBE: ${formatCurrency(valorReceberSePassarX)}</p>
                <p>EM ${num}x DE ${formatCurrency(amount/num)}</p>
            </div>
            <div style="border: 1px solid #000; padding: 10px; border-radius: 5px; background: #f9f9f9;">
                <p>SE VOCÊ QUER RECEBER: ${formatCurrency(amount)}</p>
                <p>VOCÊ PASSA: ${formatCurrency(valorCobrarParaReceberX)}</p>
                <p>EM ${num}x DE ${formatCurrency(valorCobrarParaReceberX/num)}</p>
            </div>
        </div>
        <div style="text-align: center; margin-top: 10px; font-size: 11px; border-top: 1px solid #000; padding-top: 10px; font-weight: bold; color: #000;">
            <p>Telefone: (82) 9 9330-1661 | @gilliardfinanceira</p>
            <p>Endereço: R. Dr. Rômulo de almeida 02, Próx aos Correios</p>
            <p>São Miguel dos Campos - AL</p>
        </div>
    `;
    printModal.style.display = 'block';
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0,0,0);
    doc.text("Gilliard Cred", 105, 30, { align: "center" });
    doc.setFontSize(10);
    doc.text("Comprovante de Simulação", 105, 40, { align: "center" });
    doc.text("Telefone: (82) 9 9330-1661 | @gilliardfinanceira", 105, 130, { align: "center" });
    doc.save(`Simulacao_Gilliard.pdf`);
}
