import ConfirmPasswordBox from '../../components/text-input/confirm-password-box.js';
import PasswordBox from '../../components/text-input/password-box.js';

defineElement('password-box', PasswordBox);
defineElement('confirm-password-box', ConfirmPasswordBox);

const getErrorElement = host => host.querySelector('[data-role="error-message"]');

describe('ConfirmPasswordBox: Initial State', () => {
    /** @type {HTMLInputElement} */
    let input;
    /** @type {ConfirmPasswordBox} */
    let host;

    beforeEach(async () => {
        [input, host] = await initInputBase('<confirm-password-box label="Şifreyi Doğrula"></confirm-password-box>');
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('autocomplete should be new-password', () => {
        expect(input.autocomplete).toBe('new-password');
    });

    it('input type should be password by default', () => {
        expect(input.type).toBe('password');
    });

    it('matchSelector should be undefined by default', () => {
        expect(host.matchSelector).toBeUndefined();
    });

    it('inherits toggle visibility from PasswordBox', () => {
        const toggleButton = host.querySelector('[data-role="toggle-visibility"]');
        expect(toggleButton).not.toBeNull();
    });
});

describe('ConfirmPasswordBox: Matching Validation', () => {
    /** @type {HTMLInputElement} */
    let passwordInput;
    /** @type {HTMLInputElement} */
    let confirmInput;
    /** @type {ConfirmPasswordBox} */
    let confirmHost;
    /** @type {import('@testing-library/user-event').UserEvent} */
    let user;

    beforeEach(async () => {
        document.body.setAttribute('lang', 'tr');
        document.body.innerHTML = `
            <password-box label="Şifre" id="password"></password-box>
            <confirm-password-box label="Şifreyi Doğrula" match-selector="[id='password']"></confirm-password-box>
        `;

        const passwordHost = document.body.querySelector('password-box');
        confirmHost = document.body.querySelector('confirm-password-box');

        await passwordHost.updateComplete;
        await confirmHost.updateComplete;

        passwordInput = passwordHost.inputElement;
        confirmInput = confirmHost.inputElement;

        user = (await import('@testing-library/user-event')).default.setup();
        passwordInput.focus();
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('is valid when passwords match', async () => {
        await user.type(passwordInput, 'MyPassword123');
        confirmInput.focus();
        await user.type(confirmInput, 'MyPassword123');
        await user.tab();

        expect(getErrorElement(confirmHost)).toBeNull();
        expect(confirmHost.invalid).toBe(false);
    });

    it('shows mismatch error when passwords do not match', async () => {
        await user.type(passwordInput, 'MyPassword123');
        confirmInput.focus();
        await user.type(confirmInput, 'DifferentPass');
        await user.tab();

        const errorElement = getErrorElement(confirmHost);
        expect(errorElement).not.toBeNull();
        expect(confirmHost.invalid).toBe(true);
        expect(errorElement.textContent).toContain('eşleşmiyor');
    });

    it.skip('becomes valid when corrected after mismatch', async () => {
        await user.type(passwordInput, 'MyPassword123');
        confirmInput.focus();
        await user.type(confirmInput, 'Wrong');
        await user.tab();

        expect(confirmHost.invalid).toBe(true);

        // Clear and correct the confirm password
        await user.clear(confirmInput);
        await user.type(confirmInput, 'MyPassword123');
        await confirmHost.updateComplete;

        expect(getErrorElement(confirmHost)).toBeNull();
        expect(confirmHost.invalid).toBe(false);
    });

    it.skip('ignores match validation when selector target is not found', async () => {
        // Fill password and confirm with different values
        await user.type(passwordInput, 'MyPassword123');
        confirmInput.focus();
        await user.type(confirmInput, 'DifferentPass');
        await user.tab();

        // Should be invalid due to mismatch
        expect(confirmHost.invalid).toBe(true);
        expect(getErrorElement(confirmHost)).not.toBeNull();

        // Change selector to non-existent target
        confirmHost.setAttribute('match-selector', "[id='nonexistent']");
        await confirmHost.updateComplete;

        // Now match validation should be ignored (no target to compare)
        // So it becomes valid if there are no other validation errors
        expect(confirmHost.invalid).toBe(false);
        expect(getErrorElement(confirmHost)).toBeNull();
    });
});

describe('ConfirmPasswordBox: Dynamic Selector Update', () => {
    /** @type {HTMLInputElement} */
    let passwordInput;
    /** @type {HTMLInputElement} */
    let confirmInput;
    /** @type {ConfirmPasswordBox} */
    let confirmHost;
    /** @type {import('@testing-library/user-event').UserEvent} */
    let user;

    beforeEach(async () => {
        document.body.setAttribute('lang', 'tr');
        document.body.innerHTML = `
            <password-box label="Şifre" id="original"></password-box>
            <confirm-password-box label="Şifreyi Doğrula" match-selector="[id='original']"></confirm-password-box>
        `;

        const passwordHost = document.body.querySelector('password-box');
        confirmHost = document.body.querySelector('confirm-password-box');

        await passwordHost.updateComplete;
        await confirmHost.updateComplete;

        passwordInput = passwordHost.inputElement;
        confirmInput = confirmHost.inputElement;

        user = (await import('@testing-library/user-event')).default.setup();
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it.skip('updates target when match-selector attribute changes', async () => {
        await user.type(passwordInput, 'Pass123');
        confirmInput.focus();
        await user.type(confirmInput, 'Pass123');
        await user.tab();

        expect(confirmHost.invalid).toBe(false);

        // Change selector to a non-existent element
        confirmHost.setAttribute('match-selector', "[id='nonexistent']");
        await confirmHost.updateComplete;

        // Now should be invalid because target is not found
        expect(confirmHost.invalid).toBe(true);
    });
});

describe('ConfirmPasswordBox: Message Localization', () => {
    /** @type {ConfirmPasswordBox} */
    let host;

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('uses passwordMismatch message from localeMessages', async () => {
        [, host] = await initInputBase('<confirm-password-box label="Şifreyi Doğrula"></confirm-password-box>', 'tr');

        expect(host.passwordMismatchMessage).toContain('Şifreyi Doğrula');
    });

    it('passwordMismatchMessage includes label', async () => {
        [, host] = await initInputBase('<confirm-password-box label="Confirm Password"></confirm-password-box>', 'en');

        expect(host.passwordMismatchMessage).toContain('Confirm Password');
    });
});

describe('ConfirmPasswordBox: Accessibility', () => {
    /** @type {ConfirmPasswordBox} */
    let host;
    /** @type {import('@testing-library/user-event').UserEvent} */
    let user;

    beforeEach(async () => {
        [, host, user] = await initInputBase('<confirm-password-box label="Şifreyi Doğrula"></confirm-password-box>');
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('toggle button should be accessible and functional', async () => {
        const toggleButton = host.querySelector('[data-role="toggle-visibility"]');
        expect(toggleButton).not.toBeNull();
        expect(toggleButton.getAttribute('aria-label')).toBeDefined();
    });

    it('inherits aria attributes from parent input', async () => {
        const input = host.inputElement;
        expect(input.getAttribute('aria-invalid')).toBeDefined();
    });
});

describe('ConfirmPasswordBox: Edge Cases & Coverage', () => {
    /** @type {HTMLInputElement} */
    let confirmInput;
    /** @type {ConfirmPasswordBox} */
    let confirmHost;
    /** @type {import('@testing-library/user-event').UserEvent} */
    let user;

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('handles null matchTarget gracefully', async () => {
        document.body.setAttribute('lang', 'tr');
        document.body.innerHTML = '<confirm-password-box label="Şifreyi Doğrula" match-selector="[id=\'nonexistent\']"></confirm-password-box>';

        confirmHost = document.body.querySelector('confirm-password-box');
        await confirmHost.updateComplete;

        confirmInput = confirmHost.inputElement;
        user = (await import('@testing-library/user-event')).default.setup();

        await user.type(confirmInput, 'SomeValue');
        await user.tab();

        // Should be valid since no match target exists to compare
        expect(confirmHost.invalid).toBe(false);
    });

    it('skips validation when confirm input is empty (isEmpty check)', async () => {
        document.body.setAttribute('lang', 'tr');
        document.body.innerHTML = `
            <password-box label="Şifre" id="password"></password-box>
            <confirm-password-box label="Şifreyi Doğrula" match-selector="[id='password']"></confirm-password-box>
        `;

        const passwordHost = document.body.querySelector('password-box');
        confirmHost = document.body.querySelector('confirm-password-box');

        await passwordHost.updateComplete;
        await confirmHost.updateComplete;

        const passwordInput = passwordHost.inputElement;
        confirmInput = confirmHost.inputElement;
        user = (await import('@testing-library/user-event')).default.setup();

        await user.type(passwordInput, 'MyPassword123');

        // Don't fill confirm input, trigger validation on match target
        passwordInput.dispatchEvent(new Event('input', { bubbles: true }));

        // Confirm should still be valid because it's empty
        expect(confirmHost.invalid).toBe(false);
    });

    it('validates only after interaction (interacted property)', async () => {
        document.body.setAttribute('lang', 'tr');
        document.body.innerHTML = `
            <password-box label="Şifre" id="password"></password-box>
            <confirm-password-box label="Şifreyi Doğrula" match-selector="[id='password']"></confirm-password-box>
        `;

        const passwordHost = document.body.querySelector('password-box');
        confirmHost = document.body.querySelector('confirm-password-box');

        await passwordHost.updateComplete;
        await confirmHost.updateComplete;

        const passwordInput = passwordHost.inputElement;
        confirmInput = confirmHost.inputElement;

        // Set values programmatically (no user interaction)
        passwordInput.value = 'MyPassword123';
        confirmInput.value = 'DifferentPass';

        // Trigger selector change without user interaction
        confirmHost.setAttribute('match-selector', "[id='password']");
        await confirmHost.updateComplete;

        // Should not validate until user interacts
        expect(confirmHost.invalid).toBe(false);
    });

    it('properly removes old listener when selector changes', async () => {
        document.body.setAttribute('lang', 'tr');
        document.body.innerHTML = `
            <password-box label="First" id="first"></password-box>
            <password-box label="Second" id="second"></password-box>
            <confirm-password-box label="Confirm" match-selector="[id='first']"></confirm-password-box>
        `;

        const firstHost = document.body.querySelector('#first');
        const secondHost = document.body.querySelector('#second');
        confirmHost = document.body.querySelector('confirm-password-box');

        await firstHost.updateComplete;
        await secondHost.updateComplete;
        await confirmHost.updateComplete;

        const firstInput = firstHost.inputElement;
        const secondInput = secondHost.inputElement;
        confirmInput = confirmHost.inputElement;
        user = (await import('@testing-library/user-event')).default.setup();

        // Fill all matching first
        await user.type(firstInput, 'Test123');
        confirmInput.focus();
        await user.type(confirmInput, 'Test123');
        await user.tab();

        expect(confirmHost.invalid).toBe(false);

        // Fill second to match confirm
        await user.type(secondInput, 'Test123');

        // Change selector to second (now matches)
        confirmHost.setAttribute('match-selector', '#second');
        await confirmHost.updateComplete;

        // Should still be valid (now matches second input)
        expect(confirmHost.invalid).toBe(false);

        // Change first input - confirm should stay valid (listener removed from first)
        await user.clear(firstInput);
        await user.type(firstInput, 'Changed');

        // Confirm still valid because listener is on second, not first
        expect(confirmHost.invalid).toBe(false);

        // Change second input - confirm should revalidate (listener on second)
        await user.clear(secondInput);
        await user.type(secondInput, 'Other');

        // Now confirm should be invalid (mismatch with second input)
        expect(confirmHost.invalid).toBe(true);
    });

    it('calls checkValidity() immediately when selector exists and interacted', async () => {
        document.body.setAttribute('lang', 'tr');
        document.body.innerHTML = `
            <password-box label="Şifre" id="password"></password-box>
            <confirm-password-box label="Confirm" match-selector="[id='nonexistent']"></confirm-password-box>
        `;

        const passwordHost = document.body.querySelector('password-box');
        confirmHost = document.body.querySelector('confirm-password-box');

        await passwordHost.updateComplete;
        await confirmHost.updateComplete;

        confirmInput = confirmHost.inputElement;
        user = (await import('@testing-library/user-event')).default.setup();

        // Interact with confirm input first (marks as interacted)
        await user.type(confirmInput, 'Test');
        await user.tab();

        // Now change selector to valid target - should immediately validate
        confirmHost.setAttribute('match-selector', "[id='password']");
        await confirmHost.updateComplete;

        // Since values don't match and we've interacted, should be invalid
        expect(confirmHost.invalid).toBe(true);
    });
});
