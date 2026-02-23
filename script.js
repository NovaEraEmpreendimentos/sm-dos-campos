// Tabelas de taxas permanecem as mesmas
const taxasMasterVisa = {
    1: 5.50, 2: 6.30, 3: 7.05, 4: 7.64, 5: 8.23, 6: 8.81,
    7: 9.62, 8: 10.21, 9: 10.69, 10: 11.40, 11: 11.97, 12: 12.55,
    13: 14.34, 14: 14.93, 15: 15.51, 16: 16.09, 17: 16.66, 18: 17.60
};

const taxasOutros = {
    1: 6.30, 2: 6.45, 3: 7.20, 4: 8.00, 5: 8.80, 6: 9.50,
    7: 10.00, 8: 10.80, 9: 11.50, 10: 12.30, 11: 12.96, 12: 13.00,
    13: 15.00, 14: 15.65, 15: 16.25, 16: 16.90, 17: 17.50, 18: 18.50
};

// Elementos do DOM
const loanAmountInput = document.getElementById('loanAmount');
const loanTypeSelect = document.getElementById('loanType');
const installmentsSelect = document.getElementById('installments');
const calculateBtn = document.getElementById('calculateBtn');
const generatePrintBtn = document.getElementById('generatePrint');
const resultContainer = document.getElementById('result');
const tableBody = document.getElementById('tableBody');
const printModal = document.getElementById('printModal');
const printContent = document.getElementById('printContent');
const downloadPrintBtn = document.getElementById('downloadPrint');
const closePrintBtn = document.getElementById('closePrint');
const closeModalX = document.querySelector('.close');

// Popular select de parcelas
for (let i = 1; i <= 18; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `${i}x`;
    installmentsSelect.appendChild(option);
}

// Formatar moeda
function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Calcular taxas
calculateBtn.addEventListener('click', () => {
    let amountStr = loanAmountInput.value.replace('.', '').replace(',', '.');
    let amount = parseFloat(amountStr);

    if (isNaN(amount) || amount <= 0) {
        alert('Por favor, insira um valor válido.');
        return;
    }

    const type = loanTypeSelect.value;
    const taxas = type === 'master-visa' ? taxasMasterVisa : taxasOutros;
    
    tableBody.innerHTML = '';
    
    for (let i = 1; i <= 18; i++) {
        const taxa = taxas[i];
        const valorTotal = amount / (1 - (taxa / 100));
        const valorParcela = valorTotal / i;

        const row = `
            <tr>
                <td>${i}x</td>
                <td>${taxa.toFixed(2)}%</td>
                <td>${formatCurrency(valorTotal)}</td>
                <td>${formatCurrency(valorParcela)}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    }

    resultContainer.style.display = 'block';
    generatePrintBtn.style.display = 'block';
    resultContainer.scrollIntoView({ behavior: 'smooth' });
});

// Gerar Comprovante para Print
generatePrintBtn.addEventListener('click', () => {
    const amount = parseFloat(loanAmountInput.value.replace('.', '').replace(',', '.'));
    const installments = parseInt(installmentsSelect.value);
    const type = loanTypeSelect.value;
    const taxas = type === 'master-visa' ? taxasMasterVisa : taxasOutros;
    const taxa = taxas[installments];
    
    const valorTotal = amount / (1 - (taxa / 100));
    const valorParcela = valorTotal / installments;
    const bandeira = type === 'master-visa' ? 'Mastercard / Visa' : 'Elo / Hiper / Amex';

    printContent.innerHTML = `
        <div class="print-header">
            <h2 style="color: #1e3a8a; margin-bottom: 5px;">Gilliard Cred</h2>
            <p style="font-size: 0.8rem; color: #666;">( serviços e soluções financeiras )</p>
            <hr style="margin: 15px 0; border: 0; border-top: 1px solid #eee;">
            <h3 style="color: #333;">Simulação de Crédito</h3>
        </div>
        
        <div class="print-body">
            <div class="print-item">
                <span class="print-label">Valor Solicitado:</span>
                <span class="print-value">${formatCurrency(amount)}</span>
            </div>
            <div class="print-item">
                <span class="print-label">Bandeira:</span>
                <span class="print-value">${bandeira}</span>
            </div>
            <div class="print-item">
                <span class="print-label">Parcelamento:</span>
                <span class="print-value">${installments}x</span>
            </div>
            <div class="print-highlight" style="margin-top: 20px; background: #f0f7ff; padding: 15px; border-radius: 8px; border: 1px solid #3b82f6;">
                <div class="print-item" style="border:none;">
                    <span class="print-label" style="color: #1e3a8a;">Valor da Parcela:</span>
                    <span class="print-value" style="font-size: 1.4rem; color: #1e3a8a;">${formatCurrency(valorParcela)}</span>
                </div>
                <div class="print-item" style="border:none;">
                    <span class="print-label">Total a Cobrar:</span>
                    <span class="print-value">${formatCurrency(valorTotal)}</span>
                </div>
            </div>
        </div>

        <div class="print-contact" style="margin-top: 30px; text-align: center; font-size: 0.85rem; color: #555; border-top: 1px dashed #ccc; padding-top: 20px;">
            <p><strong>Gilliard Cred</strong></p>
            <p><i class="fab fa-instagram"></i> @gilliardcred | <i class="fas fa-phone"></i> (82) 9 9331-2300</p>
            <p>R. Dr. Rômulo de almeida 144, Vizinho a Magazine Luiza</p>
            <p>São Miguel dos Campos - AL</p>
            <p style="margin-top: 10px; font-size: 0.7rem;">Simulação válida por 24 horas.</p>
        </div>
    `;

    printModal.style.display = 'block';
});

// Fechar Modal
[closePrintBtn, closeModalX].forEach(btn => {
    btn.onclick = () => printModal.style.display = 'none';
});

window.onclick = (event) => {
    if (event.target == printModal) printModal.style.display = 'none';
};

// Baixar Imagem
downloadPrintBtn.addEventListener('click', () => {
    html2canvas(document.querySelector("#printContent")).then(canvas => {
        const link = document.createElement('a');
        link.download = `GilliardCred-Simulacao-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
});

// Máscara básica para o input
loanAmountInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, "");
    value = (value / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    e.target.value = value;
});
