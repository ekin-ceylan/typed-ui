import TcBox from '../../components/text-input/tc-box.js';

defineElement('tc-box', TcBox);

describe('TcBox: Masking tests', () => {
    /** @type {HTMLInputElement} */
    let input;
    /** @type {TcBox} */
    let host;
    /** @type {import('@testing-library/user-event').UserEvent} */
    let user;

    beforeEach(async () => {
        [input, host, user] = await initInputBase('<tc-box field-id="tc" label="TC Kimlik"></tc-box>');
    });

    it('accepts only digits while typing', async () => {
        await user.type(input, '10a0b00000x146!');

        expect(input.value).toBe('10000000146');
        expect(host.value).toBe('10000000146');
    });

    it('does not allow more than 11 digits', async () => {
        await user.type(input, '10000000146123');

        expect(input.value).toBe('10000000146');
        expect(input.value.length).toBe(11);
    });

    it('shows underlay mask after input with remaining underscores', async () => {
        await user.type(input, '1000');
        await host.updateComplete;

        const underlay = host.querySelector('[data-role="underlay"]');
        expect(underlay).not.toBeNull();

        const parts = underlay.querySelectorAll('pre');
        expect(parts).toHaveLength(2);
        expect(parts[0].textContent).toBe('1000');
        expect(parts[1].textContent).toBe('_______');
    });
});

describe('TcBox: Validation tests', () => {
    /** @type {HTMLInputElement} */
    let input;
    /** @type {TcBox} */
    let host;
    /** @type {import('@testing-library/user-event').UserEvent} */
    let user;

    const getErrorElement = () => host.querySelector('[data-role="error-message"]');

    beforeEach(async () => {
        [input, host, user] = await initInputBase('<tc-box field-id="tc" label="TC Kimlik" required></tc-box>');
    });

    it('shows required validation when empty', async () => {
        await user.type(input, '3');
        await user.clear(input);
        await user.tab();

        expect(input.validity.valueMissing).toBe(true);
        expect(getErrorElement()).not.toBeNull();
        expect(getErrorElement().textContent).toContain('gereklidir');
    });

    it('accepts a valid Turkish ID', async () => {
        await user.type(input, '10000000146');
        await user.tab();

        expect(getErrorElement()).toBeNull();
        expect(host.invalid).toBe(false);
    });

    it('rejects an invalid Turkish ID', async () => {
        await user.type(input, '10000000145');
        await user.tab();

        const error = getErrorElement();
        expect(error).not.toBeNull();
        expect(host.invalid).toBe(true);
        expect(error.textContent).toContain('Lütfen geçerli bir TC Kimlik giriniz.');
    });

    it('rejects an ID that starts with 0', async () => {
        await user.type(input, '01234567890');
        await user.tab();

        const error = getErrorElement();
        expect(error).not.toBeNull();
        expect(host.invalid).toBe(true);
        expect(error.textContent).toContain('Lütfen geçerli bir TC Kimlik giriniz.');
    });

    it('keeps minlength validation for incomplete values', async () => {
        await user.type(input, '1234567890');
        await user.tab();

        const error = getErrorElement();
        expect(error).not.toBeNull();
        expect(host.invalid).toBe(true);
        expect(error.textContent).toContain('en az');
    });
});

describe('TcBox: Attribute forwarding', () => {
    it('forwards numeric and length constraints', async () => {
        const [input] = await initInputBase('<tc-box field-id="tc" label="TC Kimlik"></tc-box>');

        expect(input.getAttribute('inputmode')).toBe('numeric');
        expect(input.minLength).toBe(11);
        expect(input.maxLength).toBe(11);
        expect(input.getAttribute('pattern')).toBe(String.raw`\d{11}`);
    });
});
