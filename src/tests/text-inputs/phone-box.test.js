import PhoneBox from '../../components/text-input/phone-box.js';

defineElement('phone-box', PhoneBox);

describe('PhoneBox: Default properties', () => {
    /** @type {HTMLInputElement} */
    let input;
    /** @type {PhoneBox} */
    let host;

    beforeEach(async () => {
        [input, host] = await initInputBase('<phone-box field-id="phone" label="Telefon"></phone-box>');
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('has type="tel"', () => {
        expect(input.type).toBe('tel');
    });

    it('has inputmode="tel"', () => {
        expect(input.getAttribute('inputmode')).toBe('tel');
    });

    it('has autocomplete="tel"', () => {
        expect(input.getAttribute('autocomplete')).toBe('tel');
    });

    it('has correct placeholder', () => {
        expect(input.placeholder).toBe('0(___) ___ __ __');
    });
});

describe('PhoneBox: Masking tests', () => {
    /** @type {HTMLInputElement} */
    let input;
    /** @type {PhoneBox} */
    let host;
    /** @type {import('@testing-library/user-event').UserEvent} */
    let user;

    beforeEach(async () => {
        [input, host, user] = await initInputBase('<phone-box field-id="phone" label="Telefon"></phone-box>');
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('formats full number while typing', async () => {
        await user.type(input, '02121234567');

        expect(input.value).toBe('0(212) 123 45 67');
    });

    it('formats progressively as digits are typed', async () => {
        await user.type(input, '0212');
        expect(input.value).toBe('0(212)');

        await user.type(input, '123');
        expect(input.value).toBe('0(212) 123');

        await user.type(input, '45');
        expect(input.value).toBe('0(212) 123 45');

        await user.type(input, '67');
        expect(input.value).toBe('0(212) 123 45 67');
    });

    it('rejects non-digit characters while typing', async () => {
        await user.type(input, '0212abc123XY4567');

        expect(input.value).toBe('0(212) 123 45 67');
    });

    it('does not allow more than 11 digits', async () => {
        await user.type(input, '021212345679999');

        expect(input.value).toBe('0(212) 123 45 67');
    });

    it('handles backspace correctly', async () => {
        await user.type(input, '02121234567');
        await user.keyboard('{Backspace}');

        expect(input.value).toBe('0(212) 123 45 6');
    });

    it('adds leading zero when number starts without it', async () => {
        await user.paste('2121234567');

        expect(input.value).toBe('0(212) 123 45 67');
    });

    it('paste: plain digits format (02121234567)', async () => {
        await user.paste('02121234567');

        expect(input.value).toBe('0(212) 123 45 67');
    });

    it('paste: space-separated format (0 212 123 45 67)', async () => {
        await user.paste('0 212 123 45 67');

        expect(input.value).toBe('0(212) 123 45 67');
    });

    it('paste: bracket format ((0212) 123 45 67)', async () => {
        await user.paste('(0212) 123 45 67');

        expect(input.value).toBe('0(212) 123 45 67');
    });

    it('paste: international format (+90 212 123 45 67)', async () => {
        await user.paste('+90 212 123 45 67');

        expect(input.value).toBe('0(212) 123 45 67');
    });

    it('paste: dash-separated format (0-212-123-45-67)', async () => {
        await user.paste('0-212-123-45-67');

        expect(input.value).toBe('0(212) 123 45 67');
    });
});

describe('PhoneBox: Underlay mask (ghost text)', () => {
    /** @type {HTMLInputElement} */
    let input;
    /** @type {PhoneBox} */
    let host;
    /** @type {import('@testing-library/user-event').UserEvent} */
    let user;

    beforeEach(async () => {
        [input, host, user] = await initInputBase('<phone-box field-id="phone" label="Telefon"></phone-box>');
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('shows underlay after typing begins', async () => {
        await user.type(input, '0212');
        await host.updateComplete;

        const underlay = host.querySelector('[data-role="underlay"]');
        expect(underlay).not.toBeNull();
    });

    it('underlay typed part matches input value', async () => {
        await user.type(input, '0212');
        await host.updateComplete;

        const parts = host.querySelectorAll('[data-role="underlay"] pre');
        expect(parts[0].textContent).toBe('0(212)');
    });

    it('underlay remaining part shows rest of placeholder', async () => {
        await user.type(input, '0212');
        await host.updateComplete;

        const parts = host.querySelectorAll('[data-role="underlay"] pre');
        expect(parts[1].textContent).toBe(' ___ __ __');
    });

    it('underlay shows full placeholder after value is cleared', async () => {
        await user.type(input, '0212');
        await user.clear(input);
        await host.updateComplete;

        const parts = host.querySelectorAll('[data-role="underlay"] pre');
        expect(parts[0].textContent).toBe('');
        expect(parts[1].textContent).toBe('0(___) ___ __ __');
    });
});

describe('PhoneBox: Validation tests', () => {
    /** @type {HTMLInputElement} */
    let input;
    /** @type {PhoneBox} */
    let host;
    /** @type {import('@testing-library/user-event').UserEvent} */
    let user;

    const getErrorElement = () => host.querySelector('[data-role="error-message"]');

    beforeEach(async () => {
        [input, host, user] = await initInputBase('<phone-box field-id="phone" label="Telefon" required></phone-box>');
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('does not show error before first interaction', async () => {
        await user.tab();

        expect(getErrorElement()).toBeNull();
        expect(host.invalid).toBe(false);
    });

    it('shows required error when cleared after typing', async () => {
        await user.type(input, '0212');
        await user.clear(input);
        await user.tab();

        expect(input.validity.valueMissing).toBe(true);
        expect(getErrorElement()).not.toBeNull();
        expect(getErrorElement().textContent).toContain('gereklidir');
    });

    it('shows pattern error for incomplete phone number', async () => {
        await user.type(input, '0212123');
        await user.tab();

        expect(input.validity.patternMismatch).toBe(true);
        expect(getErrorElement()).not.toBeNull();
    });

    it('passes validation for complete and correctly formatted number', async () => {
        await user.type(input, '02121234567');
        await user.tab();

        expect(input.validity.valid).toBe(true);
        expect(getErrorElement()).toBeNull();
        expect(host.invalid).toBe(false);
    });

    it('sets aria-errormessage when validation fails', async () => {
        await user.type(input, '0212');
        await user.clear(input);
        await user.tab();
        await host.updateComplete;

        expect(input.getAttribute('aria-errormessage')).toBe(host.errorId);
    });
});
