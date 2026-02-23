// Tabelas de taxas
const taxasAbaixo5k = {
    1: 10.50, 2: 11.16, 3: 11.63, 4: 12.19, 5: 12.75, 6: 13.22,
    7: 13.97, 8: 14.44, 9: 14.72, 10: 15.25, 11: 16.03, 12: 16.58,
    13: 19.40, 14: 19.87, 15: 20.34, 16: 20.81, 17: 21.28, 18: 21.75
};

const taxasAcima5k = {
    1: 10.25, 2: 10.91, 3: 11.38, 4: 11.94, 5: 12.50, 6: 12.97,
    7: 13.73, 8: 14.20, 9: 14.48, 10: 14.53, 11: 15.87, 12: 16.25,
    13: 17.07, 14: 17.56, 15: 18.04, 16: 18.53, 17: 19.01, 18: 19.50
};

// Elementos do DOM
const loanAmountInput = document.getElementById('loanAmount');
const loanTypeSelect = document.getElementById('loanType');
const installmentsSelect = document.getElementById('installments');
const calculateBtn = document.getElementById('calculateBtn');
const generatePrintBtn = document.getElementById('generatePrintBtn');
const resultArea = document.getElementById('result');
const tableBody = document.getElementById('tableBody');
const printModal = document.getElementById('printModal');
const printContent = document.getElementById('printContent');
const closeBtn = document.querySelector('.close');
const closePrintBtn = document.getElementById('closePrint');
const downloadPrintBtn = document.getElementById('downloadPrint');

// Popular select de parcelas
for (let i = 1; i <= 18; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `${i}x`;
    installmentsSelect.appendChild(option);
}

// Formatação de moeda
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Cálculo principal
function calculate() {
    const amountStr = loanAmountInput.value.replace(/\./g, '').replace(',', '.');
    const amount = parseFloat(amountStr);
    
    if (isNaN(amount) || amount <= 0) {
        alert('Por favor, insira um valor válido.');
        return;
    }

    const type = loanTypeSelect.value;
    const rates = type === 'abaixo5k' ? taxasAbaixo5k : taxasAcima5k;
    const selectedInstallments = parseInt(installmentsSelect.value);

    tableBody.innerHTML = '';
    
    Object.keys(rates).forEach(numInstallments => {
        const rate = rates[numInstallments];
        const num = parseInt(numInstallments);
        
        // Lógica de cálculo conforme solicitado
        const valorReceber = amount;
        const valorCobrar = amount / (1 - (rate / 100));
        const parcelaReceber = valorReceber / num;
        const parcelaCobrar = valorCobrar / num;

        const row = document.createElement('tr');
        
        // Destacar linha selecionada
        if (num === selectedInstallments) {
            row.classList.add('selected-row');
        }

        row.innerHTML = `
            <td>${num}x</td>
            <td>${rate.toFixed(2)}%</td>
            <td>${formatCurrency(valorReceber)}</td>
            <td>${formatCurrency(parcelaReceber)}</td>
            <td class="highlight">${formatCurrency(valorCobrar)}</td>
            <td class="highlight">${formatCurrency(parcelaCobrar)}</td>
        `;
        tableBody.appendChild(row);
    });

    resultArea.style.display = 'block';
    generatePrintBtn.style.display = 'inline-flex';
    
    // Scroll suave para o resultado
    resultArea.scrollIntoView({ behavior: 'smooth' });
}

// Gerar conteúdo para o print
function generatePrintContent() {
    const amountStr = loanAmountInput.value.replace(/\./g, '').replace(',', '.');
    const amount = parseFloat(amountStr);
    const type = loanTypeSelect.value;
    const rates = type === 'abaixo5k' ? taxasAbaixo5k : taxasAcima5k;
    const installments = parseInt(installmentsSelect.value);
    const rate = rates[installments];
    
    const valorCobrar = amount / (1 - (rate / 100));
    const parcelaCobrar = valorCobrar / installments;

    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR');
    const timeStr = now.toLocaleTimeString('pt-BR');

    printContent.innerHTML = `
        <div class="print-header">
            <div class="print-logo">Gilliard Cred</div>
            <div class="print-subtitle">( serviços e soluções financeiras )</div>
        </div>
        
        <div class="print-body">
            <h4 style="text-align: center; margin-bottom: 20px; color: #1e3a8a;">SIMULAÇÃO DE CRÉDITO</h4>
            
            <div class="print-info-grid">
                <div class="print-item">
                    <span class="print-label">Data:</span>
                    <span class="print-value">${dateStr} às ${timeStr}</span>
                </div>
                <div class="print-item">
                    <span class="print-label">Valor Solicitado:</span>
                    <span class="print-value">${formatCurrency(amount)}</span>
                </div>
                <div class="print-item">
                    <span class="print-label">Plano:</span>
                    <span class="print-value">${installments} parcelas</span>
                </div>
                <div class="print-item">
                    <span class="print-label">Taxa aplicada:</span>
                    <span class="print-value">${rate.toFixed(2)}%</span>
                </div>
            </div>

            <div class="print-highlight" style="margin-top: 20px;">
                <div class="print-item">
                    <span class="print-label">VALOR TOTAL:</span>
                    <span class="print-value" style="font-size: 1.2rem;">${formatCurrency(valorCobrar)}</span>
                </div>
                <div class="print-item">
                    <span class="print-label">VALOR DA PARCELA:</span>
                    <span class="print-value" style="font-size: 1.2rem;">${formatCurrency(parcelaCobrar)}</span>
                </div>
            </div>
        </div>

        <div class="print-contact">
            <p><strong><i class="fab fa-instagram"></i> gilliardcred</strong></p>
            <p><i class="fas fa-phone"></i> (82) 9 9331-2300</p>
            <p><i class="fas fa-map-marker-alt"></i> R. Dr. Rômulo de almeida 144, Vizinho a Magazine Luiza</p>
            <p>São Miguel dos Campos - AL</p>
            <p style="font-size: 0.7rem; margin-top: 15px; opacity: 0.7;">* Simulação sujeita a análise de crédito.</p>
        </div>
    `;

    printModal.style.display = 'block';
}

// Eventos
calculateBtn.addEventListener('click', calculate);
generatePrintBtn.addEventListener('click', generatePrintContent);

closeBtn.onclick = () => printModal.style.display = 'none';
closePrintBtn.onclick = () => printModal.style.display = 'none';

window.onclick = (event) => {
    if (event.target == printModal) {
        printModal.style.display = 'none';
    }
};

downloadPrintBtn.addEventListener('click', () => {
    const content = document.getElementById('printContent');
    html2canvas(content, {
        backgroundColor: '#ffffff',
        scale: 2
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `Simulacao_GilliardCred_${new Date().getTime()}.png`;
        link.href = canvas.toToDataURL();
        link.click();
    });
});

// Mascaras e UI
document.addEventListener('DOMContentLoaded', () => {
    // Efeito de entrada nos cards
    const cards = document.querySelectorAll('.simulator-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // Efeito de digitação no título
    const title = document.querySelector('.header h1');
    if (title) {
        const text = title.textContent;
        title.textContent = '';
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                title.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        setTimeout(typeWriter, 500);
    }
});

// Validação de entrada
loanAmountInput.addEventListener('input', function() {
    let value = this.value.replace(/[^\d.,]/g, '');
    value = value.replace(',', '.');
    this.value = value;
});

// Adicionar tooltips informativos
function addTooltips() {
    const tooltips = {
        'loanAmount': 'Digite o valor que você deseja emprestar ou receber',
        'loanType': 'Selecione a faixa de valor para aplicar as taxas corretas',
        'installments': 'Escolha em quantas parcelas deseja dividir o pagamento'
    };
    
    Object.keys(tooltips).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.title = tooltips[id];
        }
    });
}

addTooltips();
