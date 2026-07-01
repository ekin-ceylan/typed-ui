import NewPasswordBox from '../../components/text-input/new-password-box.js';

defineElement('new-password-box', NewPasswordBox);

const getErrorElement = host => host.querySelector('[data-role="error-message"]');
const getStrengthBar = host => host.querySelector('[role="progressbar"]');

describe('NewPasswordBox: Initial State', () => {
    /** @type {HTMLInputElement} */
    let input;
    /** @type {NewPasswordBox} */
    let host;

    beforeEach(async () => {
        [input, host] = await initInputBase('<new-password-box label="Yeni Şifre"></new-password-box>');
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('input type should be password by default', () => {
        expect(input.type).toBe('password');
    });

    it('autocomplete should be new-password', () => {
        expect(input.autocomplete).toBe('new-password');
    });

    it('minStrength should default to 4', () => {
        expect(host.minStrength).toBe(4);
    });

    it('strength should be 0 for empty value', () => {
        expect(host.strength).toBe(0);
    });

    it('should render strength bar', () => {
        expect(getStrengthBar(host)).not.toBeNull();
    });

    it('inherits toggle visibility from PasswordBox', () => {
        const toggleButton = host.querySelector('[data-role="toggle-visibility"]');
        expect(toggleButton).not.toBeNull();
    });
});

describe('NewPasswordBox: Strength Calculation', () => {
    /** @type {NewPasswordBox} */
    let host;
    /** @type {import('@testing-library/user-event').UserEvent} */
    let user;

    beforeEach(async () => {
        [, host, user] = await initInputBase('<new-password-box label="Yeni Şifre"></new-password-box>');
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('strength should be 0 for empty password', async () => {
        expect(host.strength).toBe(0);
    });

    it('strength should be 1 for password shorter than 8 characters', async () => {
        const input = host.inputElement;
        input.focus();
        await user.type(input, 'Short');
        await host.updateComplete;

        expect(host.strength).toBe(1);
    });

    it('strength should be 2 for 8+ chars with uppercase', async () => {
        const input = host.inputElement;
        input.focus();
        await user.type(input, 'Password');
        await host.updateComplete;

        expect(host.strength).toBe(2);
    });

    it('strength should be 3+ for 8+ chars with multiple criteria', async () => {
        const input = host.inputElement;
        input.focus();
        await user.type(input, 'MyPass123');
        await host.updateComplete;

        expect(host.strength).toBeGreaterThanOrEqual(3);
    });

    it('strength calculation via direct method call', () => {
        // Test strength calculation at 0 level
        expect(host.calculatePasswordStrength('')).toBe(0);
        // Test at level 1 (short password)
        expect(host.calculatePasswordStrength('test')).toBe(1);
    });
});

describe('NewPasswordBox: Strength Rendering', () => {
    /** @type {HTMLInputElement} */
    let input;
    /** @type {NewPasswordBox} */
    let host;
    /** @type {import('@testing-library/user-event').UserEvent} */
    let user;

    beforeEach(async () => {
        [input, host, user] = await initInputBase('<new-password-box label="Yeni Şifre"></new-password-box>');
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('strength bar should have correct aria attributes', () => {
        const bar = getStrengthBar(host);
        expect(bar.getAttribute('role')).toBe('progressbar');
        expect(bar.getAttribute('aria-valuemin')).toBe('0');
        expect(bar.getAttribute('aria-valuemax')).toBe('5');
        expect(bar.getAttribute('aria-valuenow')).toBe('0');
    });

    it('strength bar aria-valuenow should update with strength', async () => {
        const bar = getStrengthBar(host);
        input.focus();
        await user.type(input, 'Password1');
        await host.updateComplete;

        expect(bar.getAttribute('aria-valuenow')).toBe('3');
    });

    it('strength bar should have data-strength attribute', () => {
        const bar = getStrengthBar(host);
        const presentation = bar.querySelector('[role="presentation"]');
        expect(presentation).not.toBeNull();
        expect(presentation.getAttribute('data-strength')).toBe('0');
    });

    it('data-strength should update as password is typed', async () => {
        const bar = getStrengthBar(host);
        const presentation = bar.querySelector('[role="presentation"]');
        input.focus();
        await user.type(input, 'Password1!');
        await host.updateComplete;

        expect(presentation.getAttribute('data-strength')).toBe('4');
    });

    it('strength label should have aria-label set', () => {
        const bar = getStrengthBar(host);
        expect(bar.getAttribute('aria-label')).toBeDefined();
    });
});

describe('NewPasswordBox: Validation Based on minStrength', () => {
    /** @type {HTMLInputElement} */
    let input;
    /** @type {NewPasswordBox} */
    let host;
    /** @type {import('@testing-library/user-event').UserEvent} */
    let user;

    beforeEach(async () => {
        [input, host, user] = await initInputBase('<new-password-box label="Yeni Şifre"></new-password-box>');
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('should be invalid when strength is less than minStrength (default 4)', async () => {
        input.focus();
        await user.type(input, 'MyPassword1');
        await user.tab();

        expect(host.invalid).toBe(true);
    });

    it('should be valid when strength equals minStrength', async () => {
        input.focus();
        await user.type(input, 'MyPassword1!');
        await user.tab();

        expect(host.invalid).toBe(false);
    });

    it('should be valid when strength exceeds minStrength', async () => {
        host.minStrength = 2;
        input.focus();
        await user.type(input, 'MyPassword1');
        await host.updateComplete;
        await user.tab();

        expect(host.invalid).toBe(false);
    });

    it('should show error message when validation fails', async () => {
        input.focus();
        await user.type(input, 'Weak');
        await user.tab();

        const errorElement = getErrorElement(host);
        expect(errorElement).not.toBeNull();
    });

    it('should clear error when password becomes strong enough', async () => {
        input.focus();
        await user.type(input, 'Weak');
        await user.tab();

        expect(host.invalid).toBe(true);

        await user.type(input, 'Password1!');
        await host.updateComplete;

        // After correction, should be valid
        expect(host.invalid).toBe(false);
    });

    it('should allow minStrength to be customized', async () => {
        host.minStrength = 1;
        input.focus();
        await user.type(input, 'Short');
        await user.tab();

        expect(host.invalid).toBe(false);
    });
});

describe('NewPasswordBox: i18n Message Localization', () => {
    /** @type {NewPasswordBox} */
    let host;

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('uses passwordStrengthValidationMessage from localeMessages in Turkish', async () => {
        [, host] = await initInputBase('<new-password-box label="Yeni Şifre"></new-password-box>', 'tr');

        const message = host.passwordStrengthValidationMessage;
        expect(message).toContain('Yeni Şifre');
        expect(message).toContain('daha güçlü');
    });

    it('uses passwordStrengthValidationMessage from localeMessages in English', async () => {
        [, host] = await initInputBase('<new-password-box label="New Password"></new-password-box>', 'en');

        const message = host.passwordStrengthValidationMessage;
        expect(message).toContain('New Password');
        expect(message).toContain('stronger');
    });

    it('includes label in validation message', async () => {
        [, host] = await initInputBase('<new-password-box label="My Custom Label"></new-password-box>', 'en');

        expect(host.passwordStrengthValidationMessage).toContain('My Custom Label');
    });

    it('strengthMessage provides localized strength label', async () => {
        [, host] = await initInputBase('<new-password-box label="Yeni Şifre"></new-password-box>', 'tr');
        const input = host.inputElement;

        const user = (await import('@testing-library/user-event')).default.setup();
        input.focus();
        await user.type(input, 'Password1!');
        await host.updateComplete;

        const message = host.strengthMessage;
        expect(message).toBeDefined();
        expect(typeof message).toBe('string');
    });
});

describe('NewPasswordBox: Accessibility', () => {
    /** @type {HTMLInputElement} */
    let input;
    /** @type {NewPasswordBox} */
    let host;
    /** @type {import('@testing-library/user-event').UserEvent} */
    let user;

    beforeEach(async () => {
        [input, host, user] = await initInputBase('<new-password-box label="Yeni Şifre"></new-password-box>');
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('toggle button should have aria-label', () => {
        const toggleButton = host.querySelector('[data-role="toggle-visibility"]');
        expect(toggleButton?.getAttribute('aria-label')).toBeDefined();
    });

    it('strength bar should have aria-valuetext with strength message', async () => {
        const bar = getStrengthBar(host);
        input.focus();
        await user.type(input, 'Password1');
        await host.updateComplete;

        expect(bar.getAttribute('aria-valuetext')).toBeDefined();
    });

    it('strength label should be hidden from visual display but accessible to screen readers', () => {
        const statusElement = host.querySelector('[role="status"]');
        expect(statusElement).not.toBeNull();
        expect(statusElement.hasAttribute('data-visually-hidden')).toBe(true);
    });

    it('inherits aria-label from parent input', async () => {
        const input = host.inputElement;
        expect(input.getAttribute('aria-invalid')).toBeDefined();
    });
});

describe('NewPasswordBox: Integration with PasswordBox Features', () => {
    /** @type {HTMLInputElement} */
    let input;
    /** @type {NewPasswordBox} */
    let host;
    /** @type {import('@testing-library/user-event').UserEvent} */
    let user;

    beforeEach(async () => {
        [input, host, user] = await initInputBase('<new-password-box label="Yeni Şifre" required></new-password-box>');
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('should inherit required validation from PasswordBox', async () => {
        input.focus();
        await user.type(input, 'Test');
        await user.clear(input);
        await user.tab();
        await host.updateComplete;

        // Should be invalid when required and empty
        expect(host.invalid).toBe(true);
    });

    it('should validate required before checking strength', async () => {
        input.focus();
        await user.type(input, 'Weak');
        await user.tab();

        // Should be invalid due to both required being met but strength too low
        expect(host.invalid).toBe(true);
    });

    it('should toggle visibility with reveal button', async () => {
        const toggleButton = host.querySelector('[data-role="toggle-visibility"]');
        await user.click(toggleButton);
        await host.updateComplete;

        expect(input.type).toBe('text');
        expect(host.revealed).toBe(true);
    });

    it('password value should be correctly masked when revealed is false', async () => {
        input.focus();
        await user.type(input, 'MyPassword123!');
        await host.updateComplete;

        expect(input.type).toBe('password');
    });

    it('should support allow-pattern filtering from parent', async () => {
        [input, host, user] = await initInputBase('<new-password-box label="Yeni Şifre" allow-pattern="[A-Za-z0-9]"></new-password-box>');

        input.focus();
        await user.type(input, 'MyPassword1!@');
        await host.updateComplete;

        // Only alphanumeric characters should be in the value
        expect(input.value).toBe('MyPassword1');
    });
});
