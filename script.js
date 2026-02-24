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
        <div id="capture-area" style="padding: 20px; color: #000; font-family: sans-serif;">
            <div style="text-align: center; border-bottom: 2px solid #1e3a8a; padding-bottom: 10px; margin-bottom: 15px;">
                <h2 style="margin: 0; color: #1e3a8a;">Gilliard Cred</h2>
                <p style="margin: 5px 0; font-size: 12px;">Soluções Financeiras</p>
            </div>
            
            <div style="background: #f8fafc; padding: 10px; border-radius: 8px; margin-bottom: 10px; border: 1px solid #e2e8f0;">
                <p style="font-size: 11px; font-weight: bold; color: #64748b; margin-bottom: 5px;">OPÇÃO: SE VOCÊ PASSAR O VALOR</p>
                <p>Valor na Máquina: <strong>${formatCurrency(amount)}</strong></p>
                <p>Você Recebe: <strong style="color: #15803d;">${formatCurrency(valorReceberSePassarX)}</strong></p>
                <p>Parcelas: <strong>${num}x de ${formatCurrency(amount/num)}</strong></p>
            </div>

            <div style="background: #f8fafc; padding: 10px; border-radius: 8px; margin-bottom: 15px; border: 1px solid #e2e8f0;">
                <p style="font-size: 11px; font-weight: bold; color: #64748b; margin-bottom: 5px;">OPÇÃO: SE VOCÊ QUER RECEBER LÍQUIDO</p>
                <p>Valor Desejado: <strong>${formatCurrency(amount)}</strong></p>
                <p>Passar na Máquina: <strong style="color: #b91c1c;">${formatCurrency(valorCobrarParaReceberX)}</strong></p>
                <p>Parcelas: <strong>${num}x de ${formatCurrency(valorCobrarParaReceberX/num)}</strong></p>
            </div>

            <div style="text-align: center; font-size: 10px; line-height: 1.4; border-top: 1px solid #eee; padding-top: 10px;">
                <p><strong>Telefone:</strong> (82) 9 9331-2300</p>
                <p><strong>Instagram:</strong> gilliardcred</p>
                <p><strong>Endereço:</strong> R. Dr. Rômulo de almeida 144, Vizinho a Magazine Luiza</p>
                <p>São Miguel dos Campos - AL</p>
            </div>
        </div>
    `;
    printModal.style.display = 'block';
}

async function generatePDF() {
    const { jsPDF } = window.jspdf;
    const captureArea = document.getElementById('capture-area');

    // Usamos html2canvas para garantir que o estilo do banner seja preservado no PDF
    const canvas = await html2canvas(captureArea, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth() - 20; // margem 10mm
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth, pdfHeight);
    pdf.save('simulacao_gilliard_cred.pdf');
}
