import PlateBox from '../../components/text-input/plate-box.js';

defineElement('plate-box', PlateBox);

describe('Masking tests', () => {
    /** @type {HTMLInputElement} */
    let input;
    /** @type {import('@testing-library/user-event').UserEvent} */
    let user;

    /* <plate-box field-id="plate-no" label="Plaka Numarası" value="55  ty" required></plate-box> */

    beforeEach(async () => {
        const el = '<plate-box field-id="plate-no" label="Plaka Numarası"></plate-box>';
        [input, , user] = await initInputBase(el);
    });

    it('formats while typing full plate', async () => {
        await user.type(input, '34ABC123');

        expect(input.value).toBe('34 ABC 123');
    });

    it('handles backspace', async () => {
        await user.type(input, '34ABC1');
        await user.keyboard('{Backspace}');

        expect(input.value).toBe('34 ABC');
    });

    it('paste formats', async () => {
        await user.paste('06BC4567');

        expect(input.value).toBe('06 BC 4567');
    });

    it('rejects invalid char on typing', async () => {
        await user.type(input, '34A@BC123'); // @ is invalid

        expect(input.value).toBe('34 ABC 123');
    });

    it('rejects invalid char on typing', async () => {
        await user.type(input, 'gh'); // starting with char invalid

        expect(input.value).toBe(''); // should remain empty
    });

    it('uppercases on typing', async () => {
        await user.type(input, '34abc123');

        expect(input.value).toBe('34 ABC 123');
    });

    // Geri silme (backspace) ile maskenin doğru güncellenmesi

    // Caret (imleç) pozisyonunun maskeleme sonrası doğru kalması (aradan karakter silme vb. durumlar)

    // Unmask fonksiyonunun doğru çalışması (maskesiz değer)
});

describe('Validating tests', () => {
    /** @type {HTMLInputElement} */
    let input;
    /** @type {PlateBox} */
    let host;
    /** @type {import('@testing-library/user-event').UserEvent} */
    let user;
    let errorElement;

    beforeEach(async () => {
        const el = '<plate-box field-id="plate-no" label="Plaka Numarası" required></plate-box>';
        [input, host, user] = await initInputBase(el);
        errorElement = host.querySelector('[data-role="error-message"]');
    });

    it('validates required', async () => {
        await user.tab(); // focus'tan çık

        expect(input.validity.valueMissing).toBe(true);
        expect(errorElement.hidden).toBe(false);
    });

    it('enforces maxlength', async () => {
        await user.type(input, '34ABC12345'); // uzun input
        await user.tab(); // focus'tan çık

        // native davranış: maxlength aşılamaz (fazla karakterler yazılamaz)
        expect(input.value.length).toBeLessThanOrEqual(input.maxLength);
    });

    it('enforces minlength', async () => {
        await user.type(input, '34A'); // 3 chars, min is 9
        await user.tab(); // focus'tan çık

        expect(input.value).toBe('34 A');
        expect(input.validity.valid).toBe(false);
    });

    // Minimum karakter sayısı kontrolü ve hata mesajı

    // Pattern (regex) validasyonu ve hata mesajı)
});

// input, change, blur, invalid event'lerinin doğru tetiklenmesi ve state güncellenmesi
// Otomatik tamamlama (autocomplete), spellcheck, inputmode gibi attribute'ların doğru aktarılması
// Değer güncellenince update event'inin tetiklenmesi
// field-id yoksa hata
// label yoksa hata
// Erişilebilirlik (accessibility) attribute'larının doğru ayarlanması (aria-labelledby, aria-describedby vb.)
// Disabled state'in doğru uygulanması ve stil değişiklikleri
// Placeholder'ın doğru gösterilmesi
// Label'ın gizlenmesi (hide-label) durumunda erişilebilirliğin korunması
