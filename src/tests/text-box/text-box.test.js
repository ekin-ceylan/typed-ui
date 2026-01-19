import TextBox from '../../components/text-input/text-box';
import userEvent from '@testing-library/user-event';

if (!customElements.get('text-box')) {
    customElements.define('text-box', TextBox);
}

describe('TextBox: Validasyon Testleri', () => {
    /** @type {HTMLInputElement} */
    let input;
    /** @type {HTMLElement} */
    let host;
    /** @type {import('@testing-library/user-event').UserEvent} */
    let user;
    let errorElement;

    beforeEach(async () => {
        [input, host, user] = await init('<text-box field-id="name" label="Name" pattern="[A-Za-z]{4}" required minlength="3" maxlength="5"></text-box>');
        errorElement = host.querySelector('[data-role="error-message"]');
    });

    it('Required validation should show error when value is missing', async () => {
        await user.tab();

        expect(input.validity.valueMissing).toBe(true);
        expect(errorElement.hidden).toBe(false);
        expect(errorElement.textContent.trim()).toContain('gereklidir');
    });

    it('minlength kontrolü', async () => {
        await user.type(input, 'a');
        await user.tab(); // focus'tan çık

        expect(errorElement.hidden).toBe(false);
        expect(errorElement.textContent.trim()).toContain('en az');
    });

    it('maxlength prevents input beyond max length, does not show error message', async () => {
        await user.type(input, 'abcdef');
        await user.tab(); // focus'tan çık

        expect(input.value).toBe('abcde');
        expect(errorElement.hidden).toBe(true);
    });

    it('validation is not checked immediately if it is valid or not checked', async () => {
        await user.type(input, 'abc');

        expect(input.value).toBe('abc');
        expect(errorElement.hidden).toBe(true);
    });

    it('validation is checked immediately if it is not valid', async () => {
        await user.type(input, 'abc');
        await user.tab(); // focus'tan çık

        expect(errorElement.hidden).toBe(false);

        await user.type(input, 'de');

        expect(input.value).toBe('abcde');
        expect(errorElement.hidden).toBe(true);
    });

    it('if input is required and it gets empty, validation is shown immediately', async () => {
        await user.type(input, 'abc');

        expect(errorElement.hidden).toBe(true);

        await user.clear(input);

        expect(input.value).toBe('');
        expect(errorElement.hidden).toBe(false);
    });

    // pattern attr göre validasyon ve hata mesajı
});

describe('TextBox: Accessibility (A11y)', () => {
    it('associates <label> with <input> via for/id and aria-labelledby', async () => {
        const [input, host] = await init('<text-box field-id="email" label="Email"></text-box>');

        // Visible label should be linked to the input.
        const label = host.querySelector('label');
        expect(label).not.toBeNull();
        expect(label.getAttribute('for')).toBe('email');
        expect(label.id).toBe('email-label');

        expect(input.id).toBe('email');
        expect(input.getAttribute('aria-labelledby')).toBe('email-label');
        // When label is visible, aria-label should not be used.
        expect(input.hasAttribute('aria-label')).toBe(false);
    });

    it('uses aria-label when hide-label is enabled (no visible label)', async () => {
        const [input, host] = await init('<text-box field-id="email" label="Email" hide-label></text-box>');

        // No visible label rendered.
        expect(host.querySelector('label')).toBeNull();

        // Accessible name should come from aria-label.
        expect(input.getAttribute('aria-label')).toBe('Email');
        expect(input.hasAttribute('aria-labelledby')).toBe(false);
    });

    it('sets required semantics (required + aria-required) and updates label text', async () => {
        const [input, host] = await init('<text-box field-id="name" label="Name" required></text-box>');

        // Native required behavior and ARIA hint should both be present.
        expect(input.required).toBe(true);
        expect(input.getAttribute('aria-required')).toBe('true');

        // Required fields append an asterisk to the label.
        const label = host.querySelector('label');
        expect(label).not.toBeNull();
        expect(label.textContent).toContain('Name');
        expect(label.textContent).toContain('*');
    });

    it('sets aria-required="false" when required is not set', async () => {
        const [input] = await init('<text-box field-id="name" label="Name"></text-box>');
        expect(input.getAttribute('aria-required')).toBe('false');
        expect(input.required).toBe(false);
    });

    it('wires aria-errormessage to the error element id', async () => {
        const [input, host] = await init('<text-box field-id="name" label="Name" required></text-box>');

        const error = host.querySelector('[data-role="error-message"]');
        expect(error).not.toBeNull();
        expect(error.id).toBe('name-error');
        expect(input.getAttribute('aria-errormessage')).toBe('name-error');

        // Live region is important for announcing validation updates.
        expect(error.getAttribute('aria-live')).toBe('assertive');

        // By default there is no validation message, so it should be hidden.
        expect(error.hidden).toBe(true);
    });

    it('keeps accessible name coming from the label even when placeholder is present', async () => {
        const [input, host] = await init('<text-box field-id="name" label="Name" placeholder="Type here"></text-box>');

        // Placeholder should be forwarded, but it should not replace the accessible name.
        expect(input.getAttribute('placeholder')).toBe('Type here');
        expect(host.querySelector('label')).not.toBeNull();
        expect(input.hasAttribute('aria-label')).toBe(false);
        expect(input.getAttribute('aria-labelledby')).toBe('name-label');
    });

    it('forwards helper attributes: autocomplete, spellcheck, inputmode', async () => {
        const [input] = await init('<text-box field-id="name" label="Name" autocomplete="name" inputmode="text" spellcheck></text-box>');

        expect(input.getAttribute('autocomplete')).toBe('name');
        expect(input.getAttribute('inputmode')).toBe('text');
        // spellcheck is reflected; different environments may serialize it as "" or "true".
        expect(input.hasAttribute('spellcheck')).toBe(true);
        expect(input.spellcheck).toBe(true);
    });

    it('is keyboard reachable and blur triggers validation UI updates', async () => {
        const [input, host, user] = await init('<text-box field-id="name" label="Name" required></text-box>');
        const error = host.querySelector('[data-role="error-message"]');

        // Ensure input can receive focus via keyboard navigation.
        input.blur();
        expect(document.activeElement).not.toBe(input);
        await user.tab();
        expect(document.activeElement).toBe(input);

        // Blurring should run validity check and show the error.
        await user.tab();
        await host.updateComplete;
        expect(input.getAttribute('aria-invalid')).toBe('true');
        expect(error.hidden).toBe(false);
    });

    it('toggles aria-invalid when validation state changes', async () => {
        const [input, host, user] = await init('<text-box field-id="name" label="Name" required minlength="3"></text-box>');
        const error = host.querySelector('[data-role="error-message"]');

        // Trigger invalid state.
        await user.tab();
        await host.updateComplete;
        expect(input.getAttribute('aria-invalid')).toBe('true');
        expect(error.hidden).toBe(false);

        // Fix the value, then blur again.
        input.focus();
        await user.type(input, 'abc');
        await user.tab();
        await host.updateComplete;

        // When valid again, aria-invalid should be removed.
        expect(input.getAttribute('aria-invalid')).toBeNull();
        expect(error.hidden).toBe(true);
    });

    it('prevents focus when disabled', async () => {
        const [input] = await init('<text-box field-id="x" label="X" disabled></text-box>');

        // Disabled inputs are not focusable.
        expect(input.disabled).toBe(true);
        input.focus();
        expect(document.activeElement).not.toBe(input);
    });
});

// mask pattern ekle
describe.skip('TextBox: Maskeleme Testleri', () => {
    let input, host, user;

    beforeEach(async () => {
        [input, host, user] = await init('<text-box field-id="name" label="Name"></text-box>');
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

async function init(elementStr) {
    document.body.innerHTML = elementStr;

    const host = document.querySelector('text-box');
    await host.updateComplete;

    const input = host.inputElement;
    input.focus();

    const user = userEvent.setup();

    return [input, host, user];
}
