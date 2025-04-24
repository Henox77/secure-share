# SecureShare - Gizlilik Odaklı Dosya Paylaşım Servisi

SecureShare, kullanıcıların dosyalarını güvenli ve gizli bir şekilde paylaşmalarını sağlayan modern bir web uygulamasıdır. End-to-end şifreleme, otomatik silme ve kullanıcı dostu arayüz gibi özellikleriyle öne çıkar ve geliştirilmeye açıktır.
"PROJENİN HATALARI BULUNABİLİR SİZ KENDİNİZE GÖRE DÜZELTİP FORKLAYABİLİRSİNİZ"

## 🌟 Özellikler

- 🔒 End-to-end şifreleme ile güvenli dosya paylaşımı
- ⏱️ Otomatik dosya silme seçeneği
- 🎨 Modern ve kullanıcı dostu arayüz
- 📱 Responsive tasarım
- 🔐 Güvenli kimlik doğrulama sistemi
- 🚀 Hızlı dosya yükleme ve indirme
- 📊 Dosya paylaşım istatistikleri

## 🛠️ Teknolojiler

- Node.js
- Express.js
- MongoDB
- CryptoJS (Şifreleme)
- Multer (Dosya yükleme)
- JWT (Kimlik doğrulama)
- HTML5, CSS3, JavaScript

## 📋 Kurulum

1. Projeyi klonlayın:
```bash
git clone https://github.com/Henox77/secure-share.git
cd secure-share
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. `.env` dosyası oluşturun ve gerekli değişkenleri ayarlayın:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/secure-share
JWT_SECRET=your-secret-key (burada env dosyasını kullanmanıza gerek yok server.js dosyasında mongo urlsi icin yer var mongo urlnizi oraya giriniz)
```

4. Uygulamayı başlatın:
```bash
npm start
```

Geliştirme modunda çalıştırmak için:
```bash
npm run dev
```

## 🔧 Yapılandırma

Projeyi kendi ihtiyaçlarınıza göre özelleştirebilirsiniz:

- `public/` klasöründe frontend dosyalarını düzenleyebilirsiniz
- `routes/` klasöründe API rotalarını özelleştirebilirsiniz
- `models/` klasöründe veritabanı modellerini değiştirebilirsiniz

## 📝 Kullanım

1. Tarayıcınızda `http://localhost:3000` adresine gidin
2. Dosya yüklemek için "Dosya Seç" butonuna tıklayın
3. İsterseniz şifreleme ve otomatik silme seçeneklerini ayarlayın
4. "Paylaş" butonuna tıklayarak dosyanızı yükleyin
5. Paylaşım linkini alıcıyla paylaşın

## 🤝 Katkıda Bulunma

1. Bu depoyu fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## ⚠️ Güvenlik

Bu proje geliştirme amaçlı oluşturulmuştur. Prodüksiyon ortamında kullanmadan önce güvenlik testlerinden geçirilmesi önerilir.

## 📞 İletişim

Proje Sahibi - [@Henox77](https://github.com/Henox77)

Proje Linki: [https://github.com/Henox77/secure-share](https://github.com/Henox77/secure-share)

## 📸 Site İçerisinden Fotoğraf
Fotoğraf : [SecureShare Screenshot](https://i.imgur.com/qd4RYn6.png)
