document.getElementById('umkmSubmissionForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const sellerName = document.getElementById('sellerName').value;
        const phoneNumber = document.getElementById('phoneNumber').value;
        const productCategory = document.getElementById('productCategory').value;
        const productName = document.getElementById('productName').value;
        const productDescription = document.getElementById('productDescription').value;

        const whatsappNumber = '+6281273465572'; 

        let message = `Halo, saya ${sellerName} ingin mengajukan produk UMKM:\n`;
        message += `- Nama Toko/Penjual: ${sellerName}\n`;
        message += `- Nomor Telepon: ${phoneNumber}\n`;
        message += `- Kategori Produk: ${productCategory}\n`;
        message += `- Nama Produk: ${productName}\n`;
        message += `- Deskripsi Produk: ${productDescription}\n`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');

        this.reset();
    });