import TextBox from '../../components/text-input/text-box';
import userEvent from '@testing-library/user-event';

customElements.define('text-box', TextBox);

describe('TextBox: Validasyon Testleri', () => {
    /** @type {HTMLInputElement} */
    let input;
    /** @type {HTMLElement} */
    let host;
    /** @type {import('@testing-library/user-event').UserEvent} */
    let user;
    let errorElement;

    beforeEach(async () => {
        [input, host, user] = await init('<text-box field-id="name" label="Name" required minlength="3" maxlength="5"></text-box>');
        errorElement = host.querySelector('[data-role="error-message"]');
    });

    it('zorunlu alan uyarısı verir', async () => {
        await user.tab(); // focus'tan çık
        await host.updateComplete;

        expect(input.validity.valueMissing).toBe(true);
        expect(errorElement.hidden).toBe(false);
        expect(errorElement.textContent.trim()).toContain('gereklidir');
    });

    it('minlength kontrolü', async () => {
        await user.type(input, 'a');
        await user.tab(); // focus'tan çık
        await host.updateComplete;
        expect(errorElement.hidden).toBe(false);
        expect(errorElement.textContent.trim()).toContain('en az');
    });

    it('maxlength kontrolü', async () => {
        await user.type(input, 'abcdef');
        await user.tab(); // focus'tan çık
        await host.updateComplete;

        // native davranış: maxlength fazla karakteri engeller, hata mesajı üretmez
        expect(input.value).toBe('abcde');
        expect(errorElement.hidden).toBe(true);
    });

    // pattern attr göre validasyon ve hata mesajı
});

describe.skip('TextBox: Maskeleme Testleri', () => {
    let input, host, user;

    beforeEach(async () => {
        [input, host, user] = await init('<text-box field-id="name" label="Name" pattern="[A-Z]{3}" maxlength="3"></text-box>');
    });

    it('mask fonksiyonu büyük harfe çevirir', async () => {
        await user.type(input, 'abc');
        await host.updateComplete;
        expect(input.value).toBe('ABC');
    });

    it.skip('pattern dışı karakterleri engeller', async () => {
        await user.type(input, 'ab1');
        await host.updateComplete;
        expect(input.value).toBe('AB');
    });

    // pattern attr göre maskeleme
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

    const user = userEvent.setup();

    return [input, host, user];
}
