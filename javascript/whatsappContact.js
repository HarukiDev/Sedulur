const whatsappContactForm = document.getElementById('whatsappContactForm');
const whatsappNumber = '6281273465572'; 

if (whatsappContactForm) {
    whatsappContactForm.addEventListener('submit', function(event) {
        event.preventDefault(); 

        const fullName = document.getElementById('fullName').value;
        const emailOptional = document.getElementById('emailOptional').value;
        const message = document.getElementById('message').value;

        let whatsappMessage = `Halo Sedulur UMKM,\n\n`;
        whatsappMessage += `Saya ${fullName} ingin menghubungi Anda.\n\n`;
        if (emailOptional) {
            whatsappMessage += `Email saya: ${emailOptional}\n\n`;
        }
        whatsappMessage += `Pesan saya:\n${message}\n\n`;
        whatsappMessage += `Terima kasih!`;

        const encodedMessage = encodeURIComponent(whatsappMessage);

        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');

        whatsappContactForm.reset();
    });
}