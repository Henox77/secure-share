document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const encryptFile = document.getElementById('encryptFile');
    const selfDestruct = document.getElementById('selfDestruct');
    const destructTime = document.getElementById('destructTime');
    const shareSection = document.getElementById('shareSection');
    const shareLink = document.getElementById('shareLink');

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--primary-color)';
        dropZone.style.backgroundColor = 'rgba(108, 92, 231, 0.05)';
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--border-color)';
        dropZone.style.backgroundColor = 'white';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--border-color)';
        dropZone.style.backgroundColor = 'white';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    selfDestruct.addEventListener('change', () => {
        destructTime.disabled = !selfDestruct.checked;
    });

    async function handleFile(file) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('encrypt', encryptFile.checked);
            
            if (selfDestruct.checked) {
                const hours = parseInt(destructTime.value);
                const expiresAt = new Date();
                expiresAt.setHours(expiresAt.getHours() + hours);
                formData.append('expiresAt', expiresAt.toISOString());
            }

            const response = await fetch('/api/files/upload', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                shareSection.style.display = 'block';
                shareLink.value = `${window.location.origin}${data.downloadUrl}`;
                
                showNotification('Dosya başarıyla yüklendi!', 'success');
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Dosya yükleme hatası:', error);
            showNotification('Dosya yüklenirken bir hata oluştu: ' + error.message, 'error');
        }
    }
});

function copyLink() {
    const shareLink = document.getElementById('shareLink');
    shareLink.select();
    document.execCommand('copy');
    
    const copyBtn = document.querySelector('.copy-btn');
    const originalText = copyBtn.innerHTML;
    copyBtn.innerHTML = '<i class="fas fa-check"></i> Kopyalandı!';
    
    setTimeout(() => {
        copyBtn.innerHTML = originalText;
    }, 2000);

    showNotification('Bağlantı kopyalandı!', 'success');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

async function encryptFile(file) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('Şifrelenmiş dosya');
        }, 1000);
    });
}

async function uploadFile(file) {

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('https://localhost:3000/files/' + generateRandomId());
        }, 2000);
    });
} 