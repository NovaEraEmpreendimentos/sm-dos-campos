async function generatePDF() {
    const { jsPDF } = window.jspdf;
    
    // Criamos o PDF
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // Capturamos as informações atuais do card
    const valorTotal = loanAmountInput.value;
    const parcelas = installmentsSelect.value;
    const infoContent = document.getElementById('printContent').innerText;

    // Configuração do texto no PDF (Organizado em uma única página)
    doc.setFontSize(22);
    doc.setTextColor(30, 58, 138); // Azul escuro
    doc.text("Gilliard Cred - Simulação", 105, 20, { align: "center" });
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Valor da Simulação: R$ ${valorTotal}`, 20, 40);
    doc.text(`Parcelamento Selecionado: ${parcelas}x`, 20, 50);
    
    doc.setLineWidth(0.5);
    doc.line(20, 55, 190, 55);

    // Adiciona o detalhamento que aparece no card
    doc.setFontSize(12);
    const splitText = doc.splitTextToSize(infoContent, 170);
    doc.text(splitText, 20, 65);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Contato: (82) 9 9330-1661 | @gilliardfinanceira", 105, 280, { align: "center" });

    doc.save("simulacao_gilliard_cred.pdf");
}
