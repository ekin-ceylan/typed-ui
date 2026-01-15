import TextBox from '../components/text-input/text-box';
import { pressTab, typeSequence } from './interaction-helper';

customElements.define('text-box', TextBox);

describe('TextBox: Validasyon Testleri', () => {
    /** @type {HTMLInputElement} */
    let input;
    /** @type {HTMLElement} */
    let host;
    let errorElement;

    beforeEach(async () => {
        [input, host] = await init('<text-box field-id="name" label="Name" required minlength="3" maxlength="5"></text-box>');
        errorElement = host.querySelector('[data-role="error-message"]');
    });

    it('zorunlu alan uyarısı verir', () => {
        pressTab(input); // focus'tan çık

        expect(input.validity.valueMissing).toBe(true);
        expect(errorElement.textContent).not.empty; // Hata mesajı gösteriliyor mu
    });

    it('minlength kontrolü', async () => {
        typeSequence(input, 'a');
        pressTab(input); // focus'tan çık
        await host.updateComplete;
        expect(errorElement.textContent).toContain('en az');
    });

    // it('maxlength kontrolü', async () => {
    //     typeSequence(input, 'abcdef');
    //     pressTab(input); // focus'tan çık
    //     await host.updateComplete;
    //     expect(errorElement.textContent).toContain('en fazla');
    // });
});

describe.skip('TextBox: Maskeleme Testleri', () => {
    let input, host;
    beforeEach(async () => {
        [input, host] = await init('<text-box field-id="name" label="Name" pattern="[A-Z]{3}" maxlength="3"></text-box>');
    });

    it('mask fonksiyonu büyük harfe çevirir', () => {
        expect(host.mask('abc')).toBe('ABC');
    });

    it('pattern dışı karakterleri engeller', () => {
        input.value = 'ab1';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        const host = input.closest('text-box');
        expect(host.validationMessage).toContain('geçerli bir');
    });
});

describe.skip('TextBox: Erişebilirlik Testleri', () => {
    let input, host;

    beforeEach(async () => {
        [input, host] = await init('<text-box field-id="name" label="Name" required></text-box>');
    });

    it('label doğru şekilde render edilir', () => {
        const label = host.querySelector('label');
        expect(label).not.toBeNull();
        expect(label.textContent).toBe('Name');
    });

    it('input aria-required attribute içerir', () => {
        expect(input.getAttribute('aria-required')).toBe('true');
    });
});

async function init(elementStr) {
    document.body.innerHTML = elementStr;
    const host = document.querySelector('text-box');
    await host.updateComplete;
    const input = host.inputElement;
    input.focus();

    return [input, host];
}
