import PasswordBox from './password-box.js';

export default class ConfirmPasswordBox extends PasswordBox {
    #matchTarget = null;

    // Target (match) alanı değiştiğinde otomatik yeniden doğrulama yok (input listener bağlanmıyor).
    // aria-invalid yönetimi yok (hata durumunda set / düzelince remove).
    // Mismatch mesajı için kullanıcıya okunacak canlı (aria-live) bir bölge yok.
    // Input alanı mismatch bilgisini veya açıklamasını ilişkilendirecek aria-describedby yok.
    // match attribute değişirse eski target dinleyicisi kaldırılmıyor (şu an hiç eklenmediği için yok; eklenince unbind gerekir).
    // match bulunamazsa validate sessizce geçiyor; isteğe bağlı uyarı veya erken return stratejisi belirlenmemiş.
    // validate her çağrıda DOM query yapıyor; hedef cache yok (performans / tutarlılık).
    // Hata mesajının kullanıcıya (screen reader) ne zaman iletileceği net değil (live region eksik).
    // Boş match değeri senaryosu (undefined/null) için erken guard yok.

    static properties = {
        match: { type: String }, // CSS selector (confirm)
    };

    validate(value) {
        const base = super.validate(value);
        if (base) return base;

        if (this.#matchTarget?.value !== value) return 'Şifreler eşleşmiyor.';
    }

    firstUpdated() {
        super.firstUpdated();
        this.#matchTarget = this.getRootNode().querySelector(this.match);
    }

    constructor() {
        super();

        this.autocomplete = 'new-password';
    }
}

customElements.define('confirm-password-box', ConfirmPasswordBox);
