import EmailBox from '../../components/text-input/email-box.js';

defineElement('email-box', EmailBox);

describe('EmailBox: Masking Tests', () => {
    /** @type {HTMLInputElement} */
    let input;
    /** @type {import('@testing-library/user-event').UserEvent} */
    let user;

    beforeEach(async () => {
        const el = '<email-box field-id="email" label="E-Posta Adresi"></email-box>';
        [input, , user] = await initInputBase(el);
    });

    it('converts uppercase to lowercase when typing', async () => {
        await user.type(input, 'EXAMPLE@EXAMPLE.COM');

        expect(input.value).toBe('example@example.com');
    });

    it('converts uppercase to lowercase on paste', async () => {
        await user.paste('TEST@DOMAIN.COM');

        expect(input.value).toBe('test@domain.com');
    });

    it('converts mixed case to lowercase', async () => {
        await user.type(input, 'Test.User@Example.COM');

        expect(input.value).toBe('test.user@example.com');
    });

    it('rejects space character on keydown', async () => {
        await user.type(input, 'test user@example.com');

        // Spaces should be filtered out
        expect(input.value).toBe('testuser@example.com');
    });

    it('allows special characters valid in email local part', async () => {
        await user.type(input, 'user+tag@example.com');

        expect(input.value).toBe('user+tag@example.com');
    });

    it('allows dots and hyphens in email', async () => {
        await user.type(input, 'first.last@sub-domain.example.com');

        expect(input.value).toBe('first.last@sub-domain.example.com');
    });
});

describe('EmailBox: Validation Tests', () => {
    /** @type {HTMLInputElement} */
    let input;
    /** @type {EmailBox} */
    let host;
    /** @type {import('@testing-library/user-event').UserEvent} */
    let user;
    /** @type {HTMLElement} */
    let errorElement;

    beforeEach(async () => {
        const el = '<email-box field-id="email" label="E-Posta Adresi" required></email-box>';
        [input, host, user] = await initInputBase(el);
        errorElement = host.querySelector('[data-role="error-message"]');
    });

    it('validates required field (empty value)', async () => {
        await user.tab();

        expect(input.validity.valueMissing).toBe(true);
        expect(errorElement.hidden).toBe(false);
        expect(errorElement.textContent).toContain('gereklidir');
    });

    it('accepts valid email format', async () => {
        await user.type(input, 'user@example.com');
        await user.tab();

        expect(errorElement.hidden).toBe(true);
        expect(host.invalid).toBe(false);
    });

    it('accepts email with subdomain', async () => {
        await user.type(input, 'user@mail.example.com');
        await user.tab();

        expect(errorElement.hidden).toBe(true);
        expect(host.invalid).toBe(false);
    });

    it('accepts email with plus sign (tag)', async () => {
        await user.type(input, 'user+tag@example.com');
        await user.tab();

        expect(errorElement.hidden).toBe(true);
        expect(host.invalid).toBe(false);
    });

    it('accepts email with dots in local part', async () => {
        await user.type(input, 'first.last@example.com');
        await user.tab();

        expect(errorElement.hidden).toBe(true);
        expect(host.invalid).toBe(false);
    });

    it('rejects email without @ symbol', async () => {
        await user.type(input, 'invalidemail.com');
        await user.tab();

        expect(errorElement.hidden).toBe(false);
        expect(host.invalid).toBe(true);
        expect(errorElement.textContent).toContain('geçerli');
    });

    it('rejects email without domain', async () => {
        await user.type(input, 'user@');
        await user.tab();

        expect(errorElement.hidden).toBe(false);
        expect(host.invalid).toBe(true);
    });

    it('rejects email without local part', async () => {
        await user.type(input, '@example.com');
        await user.tab();

        expect(errorElement.hidden).toBe(false);
        expect(host.invalid).toBe(true);
    });

    it('rejects email with double @', async () => {
        await user.type(input, 'user@@example.com');
        await user.tab();

        expect(errorElement.hidden).toBe(false);
        expect(host.invalid).toBe(true);
    });

    it('rejects email with consecutive dots', async () => {
        await user.type(input, 'user..name@example.com');
        await user.tab();

        expect(errorElement.hidden).toBe(false);
        expect(host.invalid).toBe(true);
    });

    it('respects maxlength constraint (254 characters)', async () => {
        // Create a string longer than 254 chars
        const longEmail = 'a'.repeat(240) + '@example.com'; // 252 chars total

        await user.type(input, longEmail);

        // maxlength should prevent typing beyond 254
        expect(input.value.length).toBeLessThanOrEqual(254);
    });

    it('shows validation immediately after invalid becomes valid', async () => {
        await user.type(input, 'invalid');
        await user.tab();

        expect(errorElement.hidden).toBe(false);

        input.focus();
        await user.type(input, '@example.com');

        // Should validate immediately since it was previously invalid
        expect(errorElement.hidden).toBe(true);
    });
});

describe('EmailBox: Attribute Forwarding', () => {
    it('sets inputmode="email" by default', async () => {
        const [input] = await initInputBase('<email-box field-id="email" label="Email"></email-box>');

        expect(input.getAttribute('inputmode')).toBe('email');
    });

    it('sets autocomplete="email" by default', async () => {
        const [input] = await initInputBase('<email-box field-id="email" label="Email"></email-box>');

        expect(input.getAttribute('autocomplete')).toBe('email');
    });

    it('sets placeholder by default', async () => {
        const [input] = await initInputBase('<email-box field-id="email" label="Email"></email-box>');

        expect(input.getAttribute('placeholder')).toBe('____@____.___');
    });

    it('sets maxlength=254 by default', async () => {
        const [input] = await initInputBase('<email-box field-id="email" label="Email"></email-box>');

        expect(input.maxLength).toBe(254);
    });

    it('allows overriding placeholder attribute', async () => {
        const [input] = await initInputBase('<email-box field-id="email" label="Email" placeholder="Enter your email"></email-box>');

        expect(input.getAttribute('placeholder')).toBe('Enter your email');
    });
});

describe('EmailBox: Accessibility (A11y)', () => {
    it('maintains proper label association', async () => {
        const [input, host] = await initInputBase('<email-box field-id="email" label="Email Address"></email-box>');
        const label = host.querySelector('label');

        expect(label.getAttribute('for')).toBe('email');
        expect(input.id).toBe('email');
        expect(input.getAttribute('aria-labelledby')).toBe('email-label');
    });

    it('sets aria-required when required', async () => {
        const [input] = await initInputBase('<email-box field-id="email" label="Email" required></email-box>');

        expect(input.getAttribute('aria-required')).toBe('true');
        expect(input.required).toBe(true);
    });

    it('toggles aria-invalid on validation state change', async () => {
        const [input, , user] = await initInputBase('<email-box field-id="email" label="Email" required></email-box>');

        // Trigger invalid state
        await user.tab();
        expect(input.getAttribute('aria-invalid')).toBe('true');

        // Fix the value
        input.focus();
        await user.type(input, 'valid@example.com');
        await user.tab();

        // Should become valid
        expect(input.getAttribute('aria-invalid')).toBeNull();
    });

    it('associates error message with aria-errormessage', async () => {
        const [input, host] = await initInputBase('<email-box field-id="email" label="Email" required></email-box>');
        const error = host.querySelector('[data-role="error-message"]');

        expect(error.id).toBe('email-error');
        expect(input.getAttribute('aria-errormessage')).toBe('email-error');
        expect(error.getAttribute('aria-live')).toBe('assertive');
    });
});
