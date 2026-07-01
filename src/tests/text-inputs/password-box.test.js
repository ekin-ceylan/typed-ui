import PasswordBox from '../../components/text-input/password-box.js';

defineElement('password-box', PasswordBox);

const getToggleButton = host => host.querySelector('[data-role="toggle-visibility"]');
const getErrorElement = host => host.querySelector('[data-role="error-message"]');

describe('PasswordBox: Initial State', () => {
    /** @type {HTMLInputElement} */
    let input;
    /** @type {PasswordBox} */
    let host;

    beforeEach(async () => {
        [input, host] = await initInputBase('<password-box label="Şifre"></password-box>');
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('input type should be password by default', () => {
        expect(input.type).toBe('password');
    });

    it('revealed property should be false by default', () => {
        expect(host.revealed).toBe(false);
    });

    it('revealed attribute should not be present by default', () => {
        expect(host.hasAttribute('revealed')).toBe(false);
    });

    it('autocomplete should be current-password', () => {
        expect(input.autocomplete).toBe('current-password');
    });

    it('toggle button should be rendered', () => {
        expect(getToggleButton(host)).not.toBeNull();
    });
});

describe('PasswordBox: Toggle Visibility', () => {
    /** @type {HTMLInputElement} */
    let input;
    /** @type {PasswordBox} */
    let host;
    /** @type {import('@testing-library/user-event').UserEvent} */
    let user;

    beforeEach(async () => {
        [input, host, user] = await initInputBase('<password-box label="Şifre"></password-box>');
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('clicking toggle button reveals the password', async () => {
        await user.click(getToggleButton(host));
        await host.updateComplete;

        expect(input.type).toBe('text');
        expect(host.revealed).toBe(true);
    });

    it('clicking toggle button again hides the password', async () => {
        await user.click(getToggleButton(host));
        await host.updateComplete;
        await user.click(getToggleButton(host));
        await host.updateComplete;

        expect(input.type).toBe('password');
        expect(host.revealed).toBe(false);
    });

    it('revealed attribute reflects to DOM when revealed is true', async () => {
        await user.click(getToggleButton(host));
        await host.updateComplete;

        expect(host.hasAttribute('revealed')).toBe(true);
    });

    it('revealed attribute is removed from DOM when hidden again', async () => {
        await user.click(getToggleButton(host));
        await host.updateComplete;
        await user.click(getToggleButton(host));
        await host.updateComplete;

        expect(host.hasAttribute('revealed')).toBe(false);
    });
});

describe('PasswordBox: Accessibility', () => {
    /** @type {PasswordBox} */
    let host;
    /** @type {import('@testing-library/user-event').UserEvent} */
    let user;

    beforeEach(async () => {
        [, host, user] = await initInputBase('<password-box label="Şifre"></password-box>');
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('toggle button aria-label should show reveal label when password is hidden', async () => {
        await host.updateComplete;
        const button = getToggleButton(host);

        expect(button.getAttribute('aria-label')).toBe(host.revealPasswordAriaLabel);
    });

    it('toggle button aria-label should show hide label when password is revealed', async () => {
        await user.click(getToggleButton(host));
        await host.updateComplete;

        expect(getToggleButton(host).getAttribute('aria-label')).toBe(host.hidePasswordAriaLabel);
    });

    it('toggle button aria-pressed should be false when password is hidden', async () => {
        await host.updateComplete;

        expect(getToggleButton(host).getAttribute('aria-pressed')).toBe('false');
    });

    it('toggle button aria-pressed should be true when password is revealed', async () => {
        await user.click(getToggleButton(host));
        await host.updateComplete;

        expect(getToggleButton(host).getAttribute('aria-pressed')).toBe('true');
    });
});

describe('PasswordBox: Validation', () => {
    /** @type {HTMLInputElement} */
    let input;
    /** @type {PasswordBox} */
    let host;
    /** @type {import('@testing-library/user-event').UserEvent} */
    let user;

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('required validation shows error when empty and blurred', async () => {
        [input, host, user] = await initInputBase('<password-box label="Şifre" required></password-box>');

        await user.type(input, 'x');
        await user.clear(input);
        await user.tab();

        expect(getErrorElement(host)).not.toBeNull();
        expect(host.invalid).toBe(true);
    });

    it('minlength validation shows error when value is too short', async () => {
        [input, host, user] = await initInputBase('<password-box label="Şifre" required minlength="8"></password-box>');

        await user.type(input, 'abc');
        await user.tab();

        const error = getErrorElement(host);
        expect(error).not.toBeNull();
        expect(error.textContent).toContain('en az');
    });

    it('maxlength prevents input beyond the limit', async () => {
        [input, host, user] = await initInputBase('<password-box label="Şifre" maxlength="5"></password-box>');

        await user.type(input, 'abcdefgh');

        expect(input.value).toBe('abcde');
        expect(getErrorElement(host)).toBeNull();
    });

    it('no error when valid value is entered and blurred', async () => {
        [input, host, user] = await initInputBase('<password-box label="Şifre" required minlength="8"></password-box>');

        await user.type(input, 'ValidPass1');
        await user.tab();

        expect(getErrorElement(host)).toBeNull();
        expect(host.invalid).toBe(false);
    });
});

describe('PasswordBox: allow-pattern', () => {
    /** @type {HTMLInputElement} */
    let input;
    /** @type {import('@testing-library/user-event').UserEvent} */
    let user;

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('blocks whitespace characters when allow-pattern="\\S"', async () => {
        [input, , user] = await initInputBase('<password-box label="Şifre" allow-pattern="\\S"></password-box>');

        await user.type(input, 'abc def');

        expect(input.value).toBe('abcdef');
    });

    it('allows all non-whitespace characters when allow-pattern="\\S"', async () => {
        [input, , user] = await initInputBase('<password-box label="Şifre" allow-pattern="\\S"></password-box>');

        await user.type(input, 'P@ss!123');

        expect(input.value).toBe('P@ss!123');
    });
});
