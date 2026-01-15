import { describe, it, expect, beforeEach } from 'vitest';
import { typeSequence, backspace, paste, pressTab } from './interaction-helper.js';
import PlateBox from '../components/text-input/plate-box.js';

customElements.define('plate-box', PlateBox);

describe('PlateBox masking tests', () => {
    /** @type {HTMLInputElement} */
    let input;

    /* <plate-box field-id="plate-no" label="Plaka Numarası" value="55  ty" required></plate-box> */

    beforeEach(async () => {
        const el = '<plate-box field-id="plate-no" label="Plaka Numarası"></plate-box>';
        input = await init(el);
    });

    it('formats while typing full plate', async () => {
        await typeSequence(input, '34ABC123');
        expect(input.value).toBe('34 ABC 123');
    });

    it('handles backspace', async () => {
        await typeSequence(input, '34ABC1');
        backspace(input);
        expect(input.value).toBe('34 ABC');
    });

    it('paste formats', () => {
        paste(input, '06BC4567');
        expect(input.value).toBe('06 BC 4567');
    });

    it('rejects invalid char on typing', async () => {
        await typeSequence(input, '34A@BC123'); // @ is invalid
        expect(input.value).toBe('34 ABC 123');
    });

    it('rejects invalid char on typing', async () => {
        await typeSequence(input, 'gh'); // starting with char invalid
        expect(input.value).toBe(''); // should remain empty
    });

    it('uppercases on typing', async () => {
        await typeSequence(input, '34abc123');
        expect(input.value).toBe('34 ABC 123');
    });

    // Geri silme (backspace) ile maskenin doğru güncellenmesi

    // Caret (imleç) pozisyonunun maskeleme sonrası doğru kalması (aradan karakter silme vb. durumlar)

    // Unmask fonksiyonunun doğru çalışması (maskesiz değer)
});

describe('PlateBox validating tests', () => {
    /** @type {HTMLInputElement} */
    let input;

    beforeEach(async () => {
        const el = '<plate-box field-id="plate-no" label="Plaka Numarası" required></plate-box>';
        input = await init(el);
    });

    it('validates required', () => {
        pressTab(input); // focus'tan çık
        expect(input.validity.valueMissing).toBe(true);
        // hata mesajını da kontrol edebilirsin
    });

    it('enforces maxlength', async () => {
        await typeSequence(input, '34ABC12345'); // 11 chars, max is 10
        pressTab(input); // focus'tan çık
        expect(input.value).toBe('34 ABC 12345');
        expect(input.validity.valid).toBe(false);
    });

    it('enforces minlength', async () => {
        await typeSequence(input, '34A'); // 3 chars, min is 9
        pressTab(input); // focus'tan çık
        expect(input.value).toBe('34 A');
        expect(input.validity.valid).toBe(false);
    });

    // Minimum karakter sayısı kontrolü ve hata mesajı

    // Pattern (regex) validasyonu ve hata mesajı)
});

async function init(elementStr) {
    document.body.innerHTML = elementStr;
    const host = document.querySelector('plate-box');
    await host.updateComplete;
    const input = host.inputElement;
    input.focus();

    return input;
}

// input, change, blur, invalid event’lerinin doğru tetiklenmesi ve state güncellenmesi
// Otomatik tamamlama (autocomplete), spellcheck, inputmode gibi attribute’ların doğru aktarılması
// Değer güncellenince update event’inin tetiklenmesi
// field-id yoksa hata
// label yoksa hata
// Erişilebilirlik (accessibility) attribute’larının doğru ayarlanması (aria-labelledby, aria-describedby vb.)
// Disabled state’in doğru uygulanması ve stil değişiklikleri
// Placeholder’ın doğru gösterilmesi
// Label’ın gizlenmesi (hide-label) durumunda erişilebilirliğin korunması
