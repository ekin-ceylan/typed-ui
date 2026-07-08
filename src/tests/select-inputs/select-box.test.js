import SelectBox from '../../components/select/select-box.js';
import CustomOption from '../../components/select/custom-option.js';
import CustomOptgroup from '../../components/select/custom-optgroup.js';

defineElement('select-box', SelectBox);
defineElement('custom-option', CustomOption);
defineElement('custom-optgroup', CustomOptgroup);

/**
 * Initializes a select-box and returns useful internals.
 * @param {string} elementStr
 */
async function initSelectBox(elementStr) {
    const [select, host, user] = await initInputBase(elementStr);
    const clearButton = host.querySelector('button[data-clear]');

    return { select, host, user, clearButton };
}

async function openSelect(select, host) {
    select.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
    await host.updateComplete;
}

describe('SelectBox - Accessibility (A11y) tests', () => {
    it('associates <label> with <select> via for/id and aria-labelledby', async () => {
        const { select, host } = await initSelectBox('<select-box label="Country"></select-box>');

        const label = host.querySelector('label');
        expect(label).not.toBeNull();
        expect(label.getAttribute('for')).toBe(host.fieldId);
        expect(label.id).toBe(host.labelId);

        expect(select.id).toBe(host.fieldId);
        expect(select.getAttribute('aria-labelledby')).toBe(host.labelId);
        expect(select.hasAttribute('aria-label')).toBe(false);
    });

    it('uses aria-label when hide-label is enabled (no visible label)', async () => {
        const { select, host } = await initSelectBox('<select-box label="Country" hide-label></select-box>');

        expect(host.querySelector('label')).toBeNull();
        expect(select.getAttribute('aria-label')).toBe('Country');
        expect(select.hasAttribute('aria-labelledby')).toBe(false);
    });

    it('sets required semantics and wires aria-errormessage', async () => {
        const { select, host } = await initSelectBox('<select-box label="Country" required><option value="tr">Turkey</option></select-box>');

        expect(host.querySelector('[data-role="error-message"]')).toBeNull();
        expect(select.getAttribute('aria-errormessage')).toBeNull();

        await openSelect(select, host);
        select.blur();
        await host.updateComplete;

        expect(select.required).toBe(true);
        expect(select.getAttribute('aria-required')).toBe('true');
        expect(select.getAttribute('aria-errormessage')).toBe(host.errorId);

        const label = host.querySelector('label');
        expect(label).not.toBeNull();
        expect(label.textContent).toContain('Country');

        const error = host.querySelector('[data-role="error-message"]');
        expect(error).not.toBeNull();
        expect(error.id).toBe(host.errorId);
        expect(error.getAttribute('aria-live')).toBe('assertive');
    });

    it('removes aria-errormessage again when the selection becomes valid', async () => {
        const { select, host, user } = await initSelectBox(
            '<select-box label="Country" required required-sign="*"><option value="tr">Turkey</option><option value="de">Germany</option></select-box>'
        );

        expect(select.getAttribute('aria-errormessage')).toBeNull();

        await openSelect(select, host);
        select.blur();
        await host.updateComplete;

        expect(select.getAttribute('aria-errormessage')).toBe(host.errorId);
        expect(host.querySelector('[data-role="error-message"]')).not.toBeNull();

        await user.selectOptions(select, 'tr');
        await host.updateComplete;

        expect(select.value).toBe('tr');
        expect(select.getAttribute('aria-errormessage')).toBeNull();
        expect(host.querySelector('[data-role="error-message"]')).toBeNull();
    });

    it('sets aria-required="false" when required is not set', async () => {
        const { select } = await initSelectBox('<select-box label="X"></select-box>');
        expect(select.getAttribute('aria-required')).toBe('false');
        expect(select.required).toBe(false);
    });
});

describe('SelectBox - Options & value', () => {
    it('parses slotted options and respects selected attribute on startup', async () => {
        const { select, host } = await initSelectBox(`
			<select-box id="color" label="Color" placeholder="Pick one">
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
			<select-box id="cities" label="Cities">
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

    it('parses slotted custom-option nodes and respects selected attribute', async () => {
        const { select, host } = await initSelectBox(`
			<select-box id="priority" label="Priority" placeholder="Pick one">
				<custom-option value="low">Low</custom-option>
				<custom-option value="high" selected>High</custom-option>
			</select-box>
		`);

        expect(host.value).toBe('high');
        expect(select.value).toBe('high');
        expect(select.options).toHaveLength(3);
        expect(select.selectedOptions[0].textContent).toContain('High');
    });

    it('renders custom-optgroup with custom-option children', async () => {
        const { select } = await initSelectBox(`
			<select-box id="cars" label="Cars">
				<custom-optgroup label="German Cars" hidden>
					<custom-option value="bmw">BMW</custom-option>
					<custom-option value="audi">Audi</custom-option>
				</custom-optgroup>
			</select-box>
		`);

        const group = select.querySelector('optgroup');
        expect(group).not.toBeNull();
        expect(group.label).toBe('German Cars');
        expect(group.hidden).toBe(true);
        expect(group.querySelectorAll('option')).toHaveLength(2);
        expect(Array.from(group.querySelectorAll('option')).map(option => option.value)).toEqual(['bmw', 'audi']);
    });

    it('renders noOptionsLabel as a disabled option when there are no options', async () => {
        const { select } = await initSelectBox('<select-box id="empty" label="Empty" placeholder="Choose"></select-box>');

        expect(select.options).toHaveLength(2);
        expect(select.options[1].disabled).toBe(true);
        expect(select.options[1].textContent).toContain('Kayıt Bulunamadı');
    });

    it('conditionally renders label attribute for slotted native option nodes', async () => {
        const { select } = await initSelectBox(`
			<select-box id="city" label="City">
				<option value="ank" label="Ankara Label">Ankara Text</option>
				<option value="ist" label="Istanbul">Istanbul</option>
				<option value="izm">Izmir</option>
			</select-box>
		`);

        const optionWithDifferentText = select.querySelector('option[value="ank"]');
        const optionWithSameText = select.querySelector('option[value="ist"]');
        const optionWithoutLabel = select.querySelector('option[value="izm"]');

        expect(optionWithDifferentText).not.toBeNull();
        expect(optionWithDifferentText.textContent.trim()).toBe('Ankara Text');
        expect(optionWithDifferentText.getAttribute('label')).toBe('Ankara Label');

        expect(optionWithSameText).not.toBeNull();
        expect(optionWithSameText.textContent.trim()).toBe('Istanbul');
        expect(optionWithSameText.getAttribute('label')).toBeNull();

        expect(optionWithoutLabel).not.toBeNull();
        expect(optionWithoutLabel.textContent.trim()).toBe('Izmir');
        expect(optionWithoutLabel.getAttribute('label')).toBeNull();
    });

    it('conditionally renders label attribute for slotted custom-option nodes', async () => {
        const { select } = await initSelectBox(`
			<select-box id="city" label="City">
				<custom-option value="ank" label="Ankara Label">Ankara Text</custom-option>
				<custom-option value="ist" label="Istanbul">Istanbul</custom-option>
				<custom-option value="izm">Izmir</custom-option>
			</select-box>
		`);

        const optionWithDifferentText = select.querySelector('option[value="ank"]');
        const optionWithSameText = select.querySelector('option[value="ist"]');
        const optionWithoutLabel = select.querySelector('option[value="izm"]');

        expect(optionWithDifferentText).not.toBeNull();
        expect(optionWithDifferentText.textContent.trim()).toBe('Ankara Text');
        expect(optionWithDifferentText.getAttribute('label')).toBe('Ankara Label');

        expect(optionWithSameText).not.toBeNull();
        expect(optionWithSameText.textContent.trim()).toBe('Istanbul');
        expect(optionWithSameText.getAttribute('label')).toBeNull();

        expect(optionWithoutLabel).not.toBeNull();
        expect(optionWithoutLabel.textContent.trim()).toBe('Izmir');
        expect(optionWithoutLabel.getAttribute('label')).toBeNull();
    });
});

describe('SelectBox - Required validation', () => {
    it('shows required error on blur when no value is selected', async () => {
        const { select, host } = await initSelectBox(`
			<select-box id="team" label="Team" required placeholder="Choose">
				<option value="a">A</option>
				<option value="b">B</option>
			</select-box>
		`);

        await openSelect(select, host);
        select.blur();
        await host.updateComplete;

        expect(select.validity.valueMissing).toBe(true);
        expect(select.getAttribute('aria-invalid')).toBe('true');
        const error = host.querySelector('[data-role="error-message"]');
        expect(error).not.toBeNull();
        expect(error.textContent.trim()).toContain('gereklidir');
    });

    it('clears the required error after a valid option is selected', async () => {
        const { select, host, user } = await initSelectBox(`
			<select-box id="team" label="Team" required placeholder="Choose">
				<option value="a">A</option>
				<option value="b">B</option>
			</select-box>
		`);

        await openSelect(select, host);
        select.blur();
        await host.updateComplete;
        expect(host.querySelector('[data-role="error-message"]')).not.toBeNull();

        await user.selectOptions(select, 'b');
        await host.updateComplete;

        expect(select.value).toBe('b');
        expect(host.value).toBe('b');
        expect(select.getAttribute('aria-invalid')).toBeNull();
        expect(host.querySelector('[data-role="error-message"]')).toBeNull();
    });
});

describe('SelectBox - Clear button', () => {
    it('clears the current value when clearable is enabled', async () => {
        const { select, host, user, clearButton } = await initSelectBox(`
			<select-box id="city" label="City" clearable>
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
    it('accepts string-only arrays in options API and renders matching values/text', async () => {
        const { select, host } = await initSelectBox('<select-box id="x" label="X"></select-box>');

        host.options = ['one', 'two', 'three'];
        await host.updateComplete;

        const options = Array.from(select.querySelectorAll('option'));
        const values = options.map(option => option.value);
        const texts = options.map(option => option.textContent.trim());

        expect(values).toEqual(expect.arrayContaining(['one', 'two', 'three']));
        expect(texts).toEqual(expect.arrayContaining(['one', 'two', 'three']));
    });

    it('accepts options arrays and renders them', async () => {
        const { select, host } = await initSelectBox('<select-box id="x" label="X"></select-box>');

        host.options = ['one', { value: 'two', label: 'Two' }];
        await host.updateComplete;

        const values = Array.from(select.querySelectorAll('option')).map(option => option.value);
        expect(values).toContain('one');
        expect(values).toContain('two');
    });

    it('renders dataset and ariaset from options API on option nodes', async () => {
        const { select, host } = await initSelectBox('<select-box id="x" label="X"></select-box>');

        host.options = [
            {
                value: 'ank',
                label: 'Ankara',
                dataset: { trackingId: 'city-ank' },
                ariaset: { label: 'Ankara option' },
            },
        ];
        await host.updateComplete;

        const option = select.querySelector('option[value="ank"]');
        expect(option).not.toBeNull();
        console.log(option.dataset);
        expect(option.dataset.trackingId).toBe('city-ank');
        expect(option.getAttribute('aria-label')).toBe('Ankara option');
    });

    it('renders dataset and ariaset from options API on optgroup nodes', async () => {
        const { select, host } = await initSelectBox('<select-box id="x" label="X"></select-box>');

        host.options = [
            {
                label: 'Turkey',
                dataset: { region: 'tr' },
                ariaset: { label: 'Turkey cities' },
                options: [{ value: 'ank', text: 'Ankara' }],
            },
        ];
        await host.updateComplete;

        const group = select.querySelector('optgroup');
        expect(group).not.toBeNull();
        expect(group.dataset.region).toBe('tr');
        expect(group.getAttribute('aria-label')).toBe('Turkey cities');
    });

    it('collects slotted aria attributes into rendered option and optgroup nodes', async () => {
        const { select } = await initSelectBox(`
            <select-box id="city" label="City">
                <optgroup label="Turkey" aria-label="Turkey group">
                    <option value="ank" aria-label="Ankara option">Ankara</option>
                </optgroup>
            </select-box>
        `);

        const group = select.querySelector('optgroup');
        const option = select.querySelector('option[value="ank"]');

        expect(group).not.toBeNull();
        expect(option).not.toBeNull();
        expect(group.getAttribute('aria-label')).toBe('Turkey group');
        expect(option.getAttribute('aria-label')).toBe('Ankara option');
    });

    it('throws when options is not an array', async () => {
        const { host } = await initSelectBox('<select-box id="x" label="X"></select-box>');

        expect(() => {
            host.options = /** @type {any} */ ('nope');
        }).toThrow(/options must be an array/i);
    });

    it('resolves display text and label attribute via options API rules', async () => {
        const { select, host } = await initSelectBox('<select-box id="x" label="X"></select-box>');

        host.options = [
            { value: 'labelOnly', label: 'Only Label' },
            { value: 'textOnly', text: 'Only Text' },
            { value: 'diff', label: 'Ankara Label', text: 'Ankara Text' },
            { value: 'same', label: 'Istanbul', text: 'Istanbul' },
        ];
        await host.updateComplete;

        const labelOnlyOption = select.querySelector('option[value="labelOnly"]');
        const textOnlyOption = select.querySelector('option[value="textOnly"]');
        const differentTextOption = select.querySelector('option[value="diff"]');
        const sameTextOption = select.querySelector('option[value="same"]');

        expect(labelOnlyOption).not.toBeNull();
        expect(labelOnlyOption.textContent.trim()).toBe('Only Label');
        expect(labelOnlyOption.getAttribute('label')).toBeNull();

        expect(textOnlyOption).not.toBeNull();
        expect(textOnlyOption.textContent.trim()).toBe('Only Text');
        expect(textOnlyOption.getAttribute('label')).toBeNull();

        expect(differentTextOption).not.toBeNull();
        expect(differentTextOption.textContent.trim()).toBe('Ankara Text');
        expect(differentTextOption.getAttribute('label')).toBe('Ankara Label');

        expect(sameTextOption).not.toBeNull();
        expect(sameTextOption.textContent.trim()).toBe('Istanbul');
        expect(sameTextOption.getAttribute('label')).toBeNull();
    });

    it('uses the first empty-value option from options API as placeholder and filters subsequent empty-value options', async () => {
        const { select, host } = await initSelectBox('<select-box id="x" label="X"></select-box>');

        host.options = [
            { value: '', text: 'Choose option' },
            { value: '', text: 'Unknown' },
            { value: 'a', text: 'Option A' },
        ];
        await host.updateComplete;

        expect(host.placeholder).toBe('Choose option');
        const allOptions = Array.from(select.querySelectorAll('option'));
        const emptyValueOptions = allOptions.filter(opt => opt.value === '');
        expect(emptyValueOptions).toHaveLength(1);
        expect(emptyValueOptions[0].textContent.trim()).toBe('Choose option');
        expect(allOptions.map(opt => opt.textContent.trim())).not.toContain('Unknown');
    });

    it('preserves optgroups in options API even when they have no valid child options', async () => {
        const { select, host } = await initSelectBox('<select-box id="x" label="X"></select-box>');

        host.options = [
            {
                label: 'Turkey',
                options: [
                    { value: 'ank', text: 'Ankara' },
                    { value: 'ist', text: 'Istanbul' },
                ],
            },
            {
                label: 'Germany',
                options: [{ value: 'ber', text: 'Berlin' }],
            },
        ];
        await host.updateComplete;

        const groups = Array.from(select.querySelectorAll('optgroup'));
        expect(groups).toHaveLength(2);
        expect(groups[0].label).toBe('Turkey');
        expect(groups[1].label).toBe('Germany');
        expect(groups[0].querySelectorAll('option')).toHaveLength(2);
        expect(groups[1].querySelectorAll('option')).toHaveLength(1);
    });

    it('handles empty options array without errors', async () => {
        const { host, select } = await initSelectBox('<select-box id="x" label="X"></select-box>');

        host.options = [];
        await host.updateComplete;

        expect(host.hasOptions).toBe(false);
        expect(host.placeholder).toBe('');
        const options = Array.from(select.querySelectorAll('option'));
        expect(options.length).toBeGreaterThanOrEqual(1);
        expect(options[0].value).toBe('');
    });

    it('sets placeholder when first option in options API has empty value but placeholder attr not set', async () => {
        const { host } = await initSelectBox('<select-box id="x" label="X"></select-box>');

        host.options = [
            { value: '', text: 'Select one' },
            { value: 'opt1', text: 'Option 1' },
        ];
        await host.updateComplete;

        expect(host.placeholder).toBe('Select one');
    });

    it('ignores empty-value option from options API when placeholder already set', async () => {
        const { host, select } = await initSelectBox('<select-box id="x" label="X" placeholder="Custom Placeholder"></select-box>');

        host.options = [
            { value: '', text: 'Auto Placeholder' },
            { value: 'opt1', text: 'Option 1' },
        ];
        await host.updateComplete;

        expect(host.placeholder).toBe('Custom Placeholder');
        const allOptions = Array.from(select.querySelectorAll('option'));
        const emptyValueOptions = allOptions.filter(opt => opt.value === '');
        expect(emptyValueOptions).toHaveLength(1);
        expect(emptyValueOptions[0].textContent.trim()).toBe('Custom Placeholder');
    });
});

describe('SelectBox - validateNode guards', () => {
    it('returns true for non-default slots', async () => {
        const { host } = await initSelectBox('<select-box id="x" label="X"></select-box>');
        const node = document.createElement('div');

        const result = host.validateNode(node, 'suffix', false);

        expect(result).toBe(true);
    });

    it('returns false and warns when slotted nodes exist while options property is already set', async () => {
        const { host } = await initSelectBox('<select-box id="x" label="X"></select-box>');
        host.options = ['one'];
        await host.updateComplete;

        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const node = document.createElement('option');
        node.value = 'two';
        node.textContent = 'Two';

        const result = host.validateNode(node, 'default', false);

        expect(result).toBe(false);
        expect(warnSpy).toHaveBeenCalledWith('Options are already set via property. Ignoring slotted nodes.');
        warnSpy.mockRestore();
    });

    it('returns false and logs error for invalid child element types', async () => {
        const { host } = await initSelectBox('<select-box id="x" label="X"></select-box>');
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const invalidNode = document.createElement('div');
        const result = host.validateNode(invalidNode, 'default', false);

        expect(result).toBe(false);
        expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Only <option> and <optgroup> elements are allowed as children of'));
        errorSpy.mockRestore();
    });
});

describe('SelectBox - keyboard and invalid handlers', () => {
    it('opens when Enter or Space is pressed on keydown', async () => {
        const { select, host } = await initSelectBox('<select-box id="x" label="X"></select-box>');

        host.open = false;
        select.dispatchEvent(new KeyboardEvent('keydown', { code: 'Enter', bubbles: true, cancelable: true }));
        expect(host.open).toBe(true);

        host.open = false;
        select.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', bubbles: true, cancelable: true }));
        expect(host.open).toBe(true);
    });

    it('closes when Escape, Tab, or Enter is pressed on keyup', async () => {
        const { select, host } = await initSelectBox('<select-box id="x" label="X"></select-box>');

        host.open = true;
        select.dispatchEvent(new KeyboardEvent('keyup', { code: 'Escape', bubbles: true, cancelable: true }));
        expect(host.open).toBe(false);

        host.open = true;
        select.dispatchEvent(new KeyboardEvent('keyup', { code: 'Tab', bubbles: true, cancelable: true }));
        expect(host.open).toBe(false);

        host.open = true;
        select.dispatchEvent(new KeyboardEvent('keyup', { code: 'Enter', bubbles: true, cancelable: true }));
        expect(host.open).toBe(false);
    });

    it('forces validation on invalid handler', async () => {
        const { select, host } = await initSelectBox(`
			<select-box id="team" label="Team" required>
				<option value="a">A</option>
			</select-box>
		`);

        select.dispatchEvent(new Event('invalid', { bubbles: false, cancelable: true }));
        await host.updateComplete;

        expect(host.invalid).toBe(true);
        expect(host.validationMessage).toContain('gereklidir');
    });
});

describe('SelectBox - Edge cases', () => {
    it('keeps initial value when options arrive later and include that value', async () => {
        const { select, host } = await initSelectBox('<select-box id="late-match" label="Late" value="ist"></select-box>');

        expect(host.value).toBe('ist');

        host.options = [
            { value: 'ank', text: 'Ankara' },
            { value: 'ist', text: 'Istanbul' },
        ];
        await host.updateComplete;

        expect(host.value).toBe('ist');
        expect(select.value).toBe('ist');
    });

    it('clears initial value when options arrive later and do not include that value', async () => {
        const { select, host } = await initSelectBox('<select-box id="late-miss" label="Late" value="ist"></select-box>');

        expect(host.value).toBe('ist');

        host.options = [
            { value: 'ank', text: 'Ankara' },
            { value: 'izm', text: 'Izmir' },
        ];
        await host.updateComplete;

        expect(host.value).toBe('');
        expect(select.value).toBe('');
    });

    it('uses the last selected option when multiple selected entries are provided via options API', async () => {
        const { select, host } = await initSelectBox('<select-box id="multi-selected" label="X"></select-box>');

        host.options = [
            { value: 'a', text: 'A', selected: true },
            { value: 'b', text: 'B', selected: true },
        ];
        await host.updateComplete;

        expect(host.value).toBe('b');
        expect(select.value).toBe('b');
    });

    it('overrides existing value when new options arrive with a selected entry', async () => {
        const { select, host } = await initSelectBox('<select-box id="override-selected" label="X" value="a"></select-box>');

        host.options = [
            { value: 'a', text: 'A' },
            { value: 'b', text: 'B' },
        ];
        await host.updateComplete;

        expect(host.value).toBe('a');

        host.options = [
            { value: 'a', text: 'A' },
            { value: 'b', text: 'B', selected: true },
        ];
        await host.updateComplete;

        expect(host.value).toBe('b');
        expect(select.value).toBe('b');
    });

    it('returns a copy from options getter so external mutations do not alter internal state', async () => {
        const { select, host } = await initSelectBox('<select-box id="copy" label="X"></select-box>');

        host.options = ['one'];
        await host.updateComplete;

        const snapshot = host.options;
        snapshot.push('two');
        await host.updateComplete;

        const values = Array.from(select.querySelectorAll('option')).map(option => option.value);
        expect(values).toContain('one');
        expect(values).not.toContain('two');
    });

    it('keeps the last assignment when options are set rapidly', async () => {
        const { select, host } = await initSelectBox('<select-box id="rapid" label="X"></select-box>');

        host.options = [{ value: 'first', text: 'First' }];
        host.options = [{ value: 'second', text: 'Second' }];
        await host.updateComplete;

        const values = Array.from(select.querySelectorAll('option')).map(option => option.value);
        expect(values).toContain('second');
        expect(values).not.toContain('first');
    });

    it('uses the first empty-value slotted option as placeholder and discards all subsequent empty-value options', async () => {
        const { select, host } = await initSelectBox(`
            <select-box id="empty-values" label="X">
                <option value="">Choose city</option>
                <option value="">Unknown city</option>
                <option value="ank">Ankara</option>
            </select-box>
        `);

        await host.updateComplete;

        const allOptions = Array.from(select.querySelectorAll('option'));
        const emptyValueOptions = allOptions.filter(option => option.value === '');

        expect(host.placeholder).toBe('Choose city');
        expect(select.options[0].textContent.trim()).toBe('Choose city');
        expect(emptyValueOptions).toHaveLength(1);
        expect(emptyValueOptions[0].textContent.trim()).toBe('Choose city');
        expect(allOptions.map(o => o.textContent.trim())).not.toContain('Unknown city');
    });

    it('clears value when value is set directly to an option that does not exist', async () => {
        const { select, host } = await initSelectBox('<select-box id="direct-invalid" label="X"></select-box>');

        host.options = [
            { value: 'ank', text: 'Ankara' },
            { value: 'ist', text: 'Istanbul' },
        ];
        await host.updateComplete;

        host.value = 'not-exists';
        await host.updateComplete;

        expect(host.value).toBe('');
        expect(select.value).toBe('');
    });
});
