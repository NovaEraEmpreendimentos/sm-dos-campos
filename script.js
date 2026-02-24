// ... (mantenha suas taxas e funções iniciais)

function showPrintModal() {
    const amount = parseFloat(loanAmountInput.value);
    const num = parseInt(installmentsSelect.value);
    const taxa = taxas[num];

    const valorReceberSePassarX = amount * (1 - taxa / 100);
    const valorCobrarParaReceberX = amount / (1 - taxa / 100);

    // Layout limpo para o PDF
    printContent.innerHTML = `
        <div style="padding: 20px; border: 2px solid #1e3a8a; border-radius: 10px; font-family: sans-serif; color: #000;">
            <div style="text-align: center; border-bottom: 2px solid #1e3a8a; padding-bottom: 10px; margin-bottom: 20px;">
                <h2 style="margin:0; color: #1e3a8a;">Gilliard Cred</h2>
                <p style="margin:5px 0; font-size: 12px;">Soluções Financeiras</p>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h4 style="background: #f0f4ff; padding: 5px;">OPÇÃO A: VOCÊ PASSA O VALOR</h4>
                <p>Valor passado na máquina: <b>${formatCurrency(amount)}</b></p>
                <p>Você recebe líquido: <b style="color: green;">${formatCurrency(valorReceberSePassarX)}</b></p>
                <p>Parcelamento: <b>${num}x de ${formatCurrency(amount/num)}</b></p>
            </div>

            <div style="margin-bottom: 20px;">
                <h4 style="background: #f0f4ff; padding: 5px;">OPÇÃO B: VOCÊ RECEBE O VALOR</h4>
                <p>Para receber líquido: <b>${formatCurrency(amount)}</b></p>
                <p>Valor a passar na máquina: <b style="color: red;">${formatCurrency(valorCobrarParaReceberX)}</b></p>
                <p>Parcelamento: <b>${num}x de ${formatCurrency(valorCobrarParaReceberX/num)}</b></p>
            </div>

            <div style="text-align: center; font-size: 10px; color: #666; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px;">
                <p>Emitido em: ${new Date().toLocaleDateString('pt-BR')}</p>
                <p>Contato: (82) 9 9330-1661 | @gilliardfinanceira</p>
                <p>São Miguel dos Campos - AL</p>
            </div>
        </div>
    `;
    printModal.style.display = 'block';
}

async function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
    });

    // Usamos o html2canvas via jsPDF ou apenas o texto. 
    // Para garantir compatibilidade total em 1 página:
    const content = document.getElementById('printContent');
    
    await doc.html(content, {
        callback: function (doc) {
            doc.save(`simulacao_gilliard_cred.pdf`);
        },
        x: 15,
        y: 15,
        width: 170, 
        windowWidth: 650
    });
}
