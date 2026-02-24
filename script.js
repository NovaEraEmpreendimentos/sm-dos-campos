async function generatePDF() {
    const { jsPDF } = window.jspdf;
    
    // Pegamos o conteúdo do modal (printContent) que já contém todas as informações
    const elementHTML = document.getElementById('printContent');
    
    // Criamos o PDF mantendo tudo em uma página
    const doc = new jsPDF({
        orientation: 'p',
        unit: 'pt',
        format: 'a4'
    });

    // Renderiza o conteúdo do card organizado no PDF
    await doc.html(elementHTML, {
        callback: function (doc) {
            doc.save('simulacao_gilliard_cred.pdf');
        },
        margin: [40, 40, 40, 40],
        autoPaging: 'slice',
        x: 0,
        y: 0,
        width: 520, // Ajuste para caber na largura do A4
        windowWidth: 600
    });
}
