const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const File = require('../models/File');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: process.env.MAX_FILE_SIZE || 100000000
    }
});

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Dosya yüklenemedi'
            });
        }

        const file = new File({
            originalName: req.file.originalname,
            fileName: req.file.filename,
            filePath: req.file.path,
            fileSize: req.file.size,
            mimeType: req.file.mimetype,
            isEncrypted: req.body.encrypt === 'true',
            expiresAt: req.body.expiresAt ? new Date(req.body.expiresAt) : null
        });

        if (file.isEncrypted) {
            const key = crypto.randomBytes(32).toString('hex');
            file.encryptionKey = key;
        }

        await file.save();

        res.json({
            success: true,
            fileId: file._id,
            downloadUrl: `/api/files/download/${file._id}`,
            expiresAt: file.expiresAt
        });
    } catch (error) {
        console.error('Dosya yükleme hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Dosya yüklenirken bir hata oluştu'
        });
    }
});

router.get('/download/:fileId', async (req, res) => {
    try {
        const file = await File.findById(req.params.fileId);
        
        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'Dosya bulunamadı'
            });
        }

        if (file.expiresAt && file.expiresAt < new Date()) {
            return res.status(410).json({
                success: false,
                message: 'Dosya süresi dolmuş'
            });
        }

        file.downloadCount += 1;
        await file.save();

        res.download(file.filePath, file.originalName);
    } catch (error) {
        console.error('Dosya indirme hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Dosya indirilirken bir hata oluştu'
        });
    }
});

router.get('/delete/:fileId', async (req, res) => {
    try {
        const file = await File.findById(req.params.fileId);
        
        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'Dosya bulunamadı'
            });
        }

        fs.unlink(file.filePath, (err) => {
            if (err) {
                console.error('Dosya silme hatası:', err);
            }
        });

        await File.findByIdAndDelete(file._id);

        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Dosya Silindi</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background-color: #1a1a1a;
                        color: #ffffff;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                    }
                    .message {
                        background-color: #2d2d2d;
                        padding: 2rem;
                        border-radius: 10px;
                        text-align: center;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
                    }
                    .success-icon {
                        color: #00b894;
                        font-size: 3rem;
                        margin-bottom: 1rem;
                    }
                    .back-link {
                        color: #6c5ce7;
                        text-decoration: none;
                        margin-top: 1rem;
                        display: inline-block;
                    }
                    .back-link:hover {
                        text-decoration: underline;
                    }
                </style>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
            </head>
            <body>
                <div class="message">
                    <i class="fas fa-check-circle success-icon"></i>
                    <h2>Dosya Başarıyla Silindi</h2>
                    <p>Dosya sistemden tamamen kaldırıldı.</p>
                    <a href="/" class="back-link">Ana Sayfaya Dön</a>
                </div>
                <script>
                    // 3 saniye sonra ana sayfaya yönlendir
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 3000);
                </script>
            </body>
            </html>
        `);
    } catch (error) {
        console.error('Dosya silme hatası:', error);
        res.status(500).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Hata</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background-color: #1a1a1a;
                        color: #ffffff;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                    }
                    .message {
                        background-color: #2d2d2d;
                        padding: 2rem;
                        border-radius: 10px;
                        text-align: center;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
                    }
                    .error-icon {
                        color: #e74c3c;
                        font-size: 3rem;
                        margin-bottom: 1rem;
                    }
                    .back-link {
                        color: #6c5ce7;
                        text-decoration: none;
                        margin-top: 1rem;
                        display: inline-block;
                    }
                    .back-link:hover {
                        text-decoration: underline;
                    }
                </style>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
            </head>
            <body>
                <div class="message">
                    <i class="fas fa-exclamation-circle error-icon"></i>
                    <h2>Hata Oluştu</h2>
                    <p>Dosya silinirken bir hata oluştu.</p>
                    <a href="/" class="back-link">Ana Sayfaya Dön</a>
                </div>
                <script>
                    // 3 saniye sonra ana sayfaya yönlendir
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 3000);
                </script>
            </body>
            </html>
        `);
    }
});

router.get('/info/:fileId', async (req, res) => {
    try {
        const file = await File.findById(req.params.fileId);
        
        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'Dosya bulunamadı'
            });
        }

        res.json({
            success: true,
            file: {
                originalName: file.originalName,
                fileSize: file.fileSize,
                mimeType: file.mimeType,
                isEncrypted: file.isEncrypted,
                expiresAt: file.expiresAt,
                downloadCount: file.downloadCount,
                createdAt: file.createdAt
            }
        });
    } catch (error) {
        console.error('Dosya bilgisi alma hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Dosya bilgisi alınırken bir hata oluştu'
        });
    }
});

module.exports = router; 