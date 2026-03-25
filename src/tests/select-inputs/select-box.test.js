import SelectBox from '../../components/select/select-box.js';

defineElement('select-box', SelectBox);

/**
 * Initializes a select-box and returns useful internals.
 * @param {string} elementStr
 */
async function initSelectBox(elementStr) {
    const [select, host, user] = await initInputBase(elementStr);
    const error = host.querySelector('[data-role="error-message"]');
    const clearButton = host.querySelector('button[data-clear]');

    return { select, host, user, error, clearButton };
}

describe('SelectBox - Accessibility (A11y) tests', () => {
    it('associates <label> with <select> via for/id and aria-labelledby', async () => {
        const { select, host } = await initSelectBox('<select-box field-id="country" label="Country"></select-box>');

        const label = host.querySelector('label');
        expect(label).not.toBeNull();
        expect(label.getAttribute('for')).toBe('country');
        expect(label.id).toBe('country-label');

        expect(select.id).toBe('country');
        expect(select.getAttribute('aria-labelledby')).toBe('country-label');
        expect(select.hasAttribute('aria-label')).toBe(false);
    });

    it('uses aria-label when hide-label is enabled (no visible label)', async () => {
        const { select, host } = await initSelectBox('<select-box field-id="country" label="Country" hide-label></select-box>');

        expect(host.querySelector('label')).toBeNull();
        expect(select.getAttribute('aria-label')).toBe('Country');
        expect(select.hasAttribute('aria-labelledby')).toBe(false);
    });

    it('sets required semantics and wires aria-errormessage', async () => {
        const { select, host, error } = await initSelectBox(
            '<select-box field-id="country" label="Country" required required-sign="*"><option value="tr">Turkey</option></select-box>'
        );

        expect(select.required).toBe(true);
        expect(select.getAttribute('aria-required')).toBe('true');
        expect(select.getAttribute('aria-errormessage')).toBe('country-error');

        const label = host.querySelector('label');
        expect(label).not.toBeNull();
        expect(label.textContent).toContain('Country');
        expect(label.textContent).toContain('*');

        expect(error).not.toBeNull();
        expect(error.id).toBe('country-error');
        expect(error.getAttribute('aria-live')).toBe('assertive');
        expect(error.hidden).toBe(true);
    });

    it('sets aria-required="false" when required is not set', async () => {
        const { select } = await initSelectBox('<select-box field-id="x" label="X"></select-box>');
        expect(select.getAttribute('aria-required')).toBe('false');
        expect(select.required).toBe(false);
    });
});

describe('SelectBox - Options & value', () => {
    it('parses slotted options and respects selected attribute on startup', async () => {
        const { select, host } = await initSelectBox(`
			<select-box field-id="color" label="Color" placeholder="Pick one">
				<option value="r">Red</option>
				<option value="g" selected>Green</option>
			</select-box>
		`);

        expect(host.value).toBe('g');
        expect(select.value).toBe('g');
        expect(select.options).toHaveLength(3);
        expect(select.selectedOptions[0].textContent).toContain('Green');
    });

    it('renders optgroup content from slotted markup', async () => {
        const { select } = await initSelectBox(`
			<select-box field-id="cities" label="Cities">
				<optgroup label="Turkey">
					<option value="ank">Ankara</option>
					<option value="ist">Istanbul</option>
				</optgroup>
			</select-box>
		`);

        const group = select.querySelector('optgroup');
        expect(group).not.toBeNull();
        expect(group.label).toBe('Turkey');
        expect(group.querySelectorAll('option')).toHaveLength(2);
    });

    it('renders noOptionsLabel as a disabled option when there are no options', async () => {
        const { select } = await initSelectBox('<select-box field-id="empty" label="Empty" placeholder="Choose"></select-box>');

        expect(select.options).toHaveLength(2);
        expect(select.options[1].disabled).toBe(true);
        expect(select.options[1].textContent).toContain('Kayıt Bulunamadı');
    });
});

describe('SelectBox - Required validation', () => {
    it('shows required error on blur when no value is selected', async () => {
        const { select, host, error } = await initSelectBox(`
			<select-box field-id="team" label="Team" required placeholder="Choose">
				<option value="a">A</option>
				<option value="b">B</option>
			</select-box>
		`);

        select.focus();
        select.blur();
        await host.updateComplete;

        expect(select.validity.valueMissing).toBe(true);
        expect(select.getAttribute('aria-invalid')).toBe('true');
        expect(error.hidden).toBe(false);
        expect(error.textContent.trim()).toContain('gereklidir');
    });

    it('clears the required error after a valid option is selected', async () => {
        const { select, host, user, error } = await initSelectBox(`
			<select-box field-id="team" label="Team" required placeholder="Choose">
				<option value="a">A</option>
				<option value="b">B</option>
			</select-box>
		`);

        select.focus();
        select.blur();
        await host.updateComplete;
        expect(error.hidden).toBe(false);

        await user.selectOptions(select, 'b');
        await host.updateComplete;

        expect(select.value).toBe('b');
        expect(host.value).toBe('b');
        expect(select.getAttribute('aria-invalid')).toBeNull();
        expect(error.hidden).toBe(true);
    });
});

describe('SelectBox - Clear button', () => {
    it('clears the current value when clearable is enabled', async () => {
        const { select, host, user, clearButton } = await initSelectBox(`
			<select-box field-id="city" label="City" clearable>
				<option value="ank" selected>Ankara</option>
				<option value="ist">Istanbul</option>
			</select-box>
		`);

        expect(clearButton).not.toBeNull();
        expect(clearButton.disabled).toBe(false);
        expect(select.value).toBe('ank');

        await user.click(clearButton);
        await host.updateComplete;

        expect(host.value).toBe('');
        expect(select.value).toBe('');
        expect(clearButton.disabled).toBe(true);
    });
});

describe('SelectBox - Options property', () => {
    it('accepts options arrays and renders them', async () => {
        const { select, host } = await initSelectBox('<select-box field-id="x" label="X"></select-box>');

        host.options = ['one', { value: 'two', label: 'Two' }];
        await host.updateComplete;

        const values = Array.from(select.querySelectorAll('option')).map(option => option.value);
        expect(values).toContain('one');
        expect(values).toContain('two');
    });

    it('throws when options is not an array', async () => {
        const { host } = await initSelectBox('<select-box field-id="x" label="X"></select-box>');

        expect(() => {
            host.options = /** @type {any} */ ('nope');
        }).toThrow(/options must be an array/i);
    });
});
