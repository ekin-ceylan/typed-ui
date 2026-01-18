import userEvent from '@testing-library/user-event';
import PlateBox from '../../components/text-input/plate-box.js';

customElements.define('plate-box', PlateBox);

describe('PlateBox masking tests', () => {
    /** @type {HTMLInputElement} */
    let input;
    /** @type {HTMLElement} */
    let host;

    /* <plate-box field-id="plate-no" label="Plaka Numarası" value="55  ty" required></plate-box> */

    beforeEach(async () => {
        const el = '<plate-box field-id="plate-no" label="Plaka Numarası"></plate-box>';
        [input, host] = await init(el);
    });

    it('formats while typing full plate', async () => {
        const user = userEvent.setup();
        input.focus();
        await user.type(input, '34ABC123');
        await host.updateComplete;
        expect(input.value).toBe('34 ABC 123');
    });

    it('handles backspace', async () => {
        const user = userEvent.setup();
        input.focus();
        await user.type(input, '34ABC1');
        await user.keyboard('{Backspace}');
        await host.updateComplete;
        expect(input.value).toBe('34 ABC');
    });

    it('paste formats', async () => {
        const user = userEvent.setup();
        input.focus();
        await user.paste('06BC4567');
        await host.updateComplete;
        expect(input.value).toBe('06 BC 4567');
    });

    it('rejects invalid char on typing', async () => {
        const user = userEvent.setup();
        input.focus();
        await user.type(input, '34A@BC123'); // @ is invalid
        await host.updateComplete;
        expect(input.value).toBe('34 ABC 123');
    });

    it('rejects invalid char on typing', async () => {
        const user = userEvent.setup();
        input.focus();
        await user.type(input, 'gh'); // starting with char invalid
        await host.updateComplete;
        expect(input.value).toBe(''); // should remain empty
    });

    it('uppercases on typing', async () => {
        const user = userEvent.setup();
        input.focus();
        await user.type(input, '34abc123');
        await host.updateComplete;
        expect(input.value).toBe('34 ABC 123');
    });

    // Geri silme (backspace) ile maskenin doğru güncellenmesi

    // Caret (imleç) pozisyonunun maskeleme sonrası doğru kalması (aradan karakter silme vb. durumlar)

    // Unmask fonksiyonunun doğru çalışması (maskesiz değer)
});

describe('PlateBox validating tests', () => {
    /** @type {HTMLInputElement} */
    let input;
    /** @type {HTMLElement} */
    let host;

    beforeEach(async () => {
        const el = '<plate-box field-id="plate-no" label="Plaka Numarası" required></plate-box>';
        [input, host] = await init(el);
    });

    it('validates required', async () => {
        const user = userEvent.setup();
        input.focus();
        await user.tab(); // focus'tan çık
        await host.updateComplete;
        expect(input.validity.valueMissing).toBe(true);
        // hata mesajını da kontrol edebilirsin
    });

    it('enforces maxlength', async () => {
        const user = userEvent.setup();
        input.focus();
        await user.type(input, '34ABC12345'); // uzun input
        await user.tab(); // focus'tan çık
        await host.updateComplete;

        // native davranış: maxlength aşılamaz (fazla karakterler yazılamaz)
        expect(input.value.length).toBeLessThanOrEqual(input.maxLength);
    });

    it('enforces minlength', async () => {
        const user = userEvent.setup();
        input.focus();
        await user.type(input, '34A'); // 3 chars, min is 9
        await user.tab(); // focus'tan çık
        await host.updateComplete;
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

    return [input, host];
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
