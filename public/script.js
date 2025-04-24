document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const mainContent = document.getElementById('mainContent');
    const loginFormElement = document.getElementById('loginFormElement');
    const registerFormElement = document.getElementById('registerFormElement');
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const encryptFile = document.getElementById('encryptFile');
    const selfDestruct = document.getElementById('selfDestruct');
    const destructTime = document.getElementById('destructTime');
    const shareSection = document.getElementById('shareSection');
    const shareLink = document.getElementById('shareLink');
    const userInfo = document.getElementById('userInfo');
    const authButtons = document.querySelector('.auth-buttons');

    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');

    if (token && userData.username) {
        showMainContent();
        showNotification(`Hoş geldiniz, ${userData.username}!`, 'success');
        updateUserInfo(userData);
        authButtons.style.display = 'none';
    }

    function updateUserInfo(user) {
        if (userInfo) {
            userInfo.innerHTML = `
                <span class="user-name">
                    <i class="fas fa-user"></i> ${user.username}
                </span>
                <button onclick="logout()" class="logout-btn">
                    <i class="fas fa-sign-out-alt"></i> Çıkış
                </button>
            `;
        }
    }

    window.logout = function() {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        window.location.href = '/';
    };

    loginBtn.addEventListener('click', () => {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    });

    registerBtn.addEventListener('click', () => {
        registerForm.style.display = 'block';
        loginForm.style.display = 'none';
    });

    loginFormElement.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userData', JSON.stringify(data.user));
                showMainContent();
                updateUserInfo(data.user);
                authButtons.style.display = 'none';
                showNotification(`Hoş geldiniz, ${data.user.username}!`, 'success');
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            showNotification(error.message, 'error');
        }
    });

    registerFormElement.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userData', JSON.stringify(data.user));
                showMainContent();
                updateUserInfo(data.user);
                authButtons.style.display = 'none';
                showNotification(`Hoş geldiniz, ${data.user.username}!`, 'success');
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            showNotification(error.message, 'error');
        }
    });

    function showMainContent() {
        loginForm.style.display = 'none';
        registerForm.style.display = 'none';
        mainContent.style.display = 'block';
    }

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (!token) {
            showNotification('Lütfen önce giriş yapın!', 'error');
            return;
        }
        dropZone.style.borderColor = 'var(--primary-color)';
        dropZone.style.backgroundColor = 'rgba(108, 92, 231, 0.1)';
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--border-color)';
        dropZone.style.backgroundColor = 'transparent';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        if (!token) {
            showNotification('Lütfen önce giriş yapın!', 'error');
            return;
        }
        dropZone.style.borderColor = 'var(--border-color)';
        dropZone.style.backgroundColor = 'transparent';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    const uploadBtn = document.querySelector('.upload-btn');
    uploadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!token) {
            showNotification('Lütfen önce giriş yapın!', 'error');
            return;
        }
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
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                shareSection.style.display = 'block';
                shareLink.value = `${window.location.origin}${data.downloadUrl}`;
                
                const deleteLink = document.createElement('div');
                deleteLink.className = 'delete-link';
                deleteLink.innerHTML = `
                    <p>Dosyayı silmek için: <a href="${window.location.origin}/api/files/delete/${data.fileId}" target="_blank">Buraya tıklayın</a></p>
                `;
                shareSection.appendChild(deleteLink);
                
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