import ComboBox from '../../components/select/combo-box.js';

defineElement('combo-box', ComboBox);

/**
 * Initializes a combo-box and returns useful internals.
 * @param {string} elementStr
 */
async function initComboBox(elementStr) {
    const [valueInput, host, user] = await initInputBase(elementStr);

    const comboboxDiv = host.querySelector('div[role="combobox"]');
    const searchInput = host.querySelector('input[data-role="search"]');
    const display = host.querySelector('div[data-role="display"]');
    const listbox = host.querySelector('div[role="listbox"]');

    if (!comboboxDiv || !searchInput || !display || !listbox) {
        throw new Error('combo-box internals not found');
    }

    return { valueInput, host, user, comboboxDiv, searchInput, display, listbox };
}

function getOptionDivs(host) {
    return Array.from(host.querySelectorAll('div[role="listbox"] div[role="option"]'));
}

async function openList({ comboboxDiv, user, host }) {
    comboboxDiv.focus();
    await user.keyboard('{Enter}');
    await host.updateComplete;
}

async function closeListWithEscape({ user, host }) {
    await user.keyboard('{Escape}');
    await host.updateComplete;
}

describe('ComboBox - Accessibility (A11y) tests', () => {
    it('associates <label> with value input via for/id and aria-labelledby', async () => {
        const { valueInput, host } = await initComboBox('<combo-box field-id="country" label="Country"></combo-box>');

        const label = host.querySelector('label');
        expect(label).not.toBeNull();
        expect(label.getAttribute('for')).toBe('country');
        expect(label.id).toBe('country-label');

        expect(valueInput.id).toBe('country');
        expect(valueInput.getAttribute('aria-labelledby')).toBe('country-label');
        expect(valueInput.hasAttribute('aria-label')).toBe(false);
    });

    it('uses aria-label when hide-label is enabled (no visible label)', async () => {
        const { valueInput, host } = await initComboBox('<combo-box field-id="country" label="Country" hide-label></combo-box>');

        expect(host.querySelector('label')).toBeNull();
        expect(valueInput.getAttribute('aria-label')).toBe('Country');
        expect(valueInput.hasAttribute('aria-labelledby')).toBe(false);
    });

    it('sets required semantics (required + aria-required) and wires aria-errormessage', async () => {
        const { valueInput, host } = await initComboBox('<combo-box field-id="country" label="Country" required required-sign="*"><option value="tr">TR</option></combo-box>');

        expect(valueInput.required).toBe(true);
        expect(valueInput.getAttribute('aria-required')).toBe('true');
        expect(host.querySelector('[data-role="error-message"]')).toBeNull();
        expect(valueInput.getAttribute('aria-errormessage')).toBeNull();

        const label = host.querySelector('label');
        expect(label).not.toBeNull();
        expect(label.textContent).toContain('Country');
        expect(label.textContent).toContain('*');
    });

    it('sets aria-required="false" when required is not set', async () => {
        const { valueInput } = await initComboBox('<combo-box field-id="x" label="X"></combo-box>');
        expect(valueInput.getAttribute('aria-required')).toBe('false');
        expect(valueInput.required).toBe(false);
    });
});

describe('ComboBox - Options & selection', () => {
    it('parses <option> children and respects selected attribute', async () => {
        const { valueInput, host, display } = await initComboBox(`
			<combo-box field-id="color" label="Color" placeholder="Pick">
				<option value="r">Red</option>
				<option value="g" selected>Green</option>
			</combo-box>
		`);

        expect(host.value).toBe('g');
        expect(valueInput.value).toBe('g');
        expect(display.textContent).toContain('Green');

        const optionDivs = getOptionDivs(host);
        expect(optionDivs.length).toBe(2);

        const selected = optionDivs.find(el => el.hasAttribute('aria-selected'));
        expect(selected).toBeTruthy();
        expect(selected.dataset.value).toBe('g');
    });

    it('opens with keyboard and selects active option with Enter', async () => {
        const ctx = await initComboBox(`
			<combo-box field-id="city" label="City" placeholder="Pick">
				<option value="a">Ankara</option>
				<option value="i">Istanbul</option>
			</combo-box>
		`);

        expect(ctx.host.value).toBe('');
        expect(ctx.display.textContent).toContain('Pick');

        await openList(ctx);
        expect(ctx.host.isOpen).toBe(true);
        expect(ctx.comboboxDiv.dataset.open).not.toBeUndefined();

        await ctx.user.keyboard('{ArrowDown}');
        await ctx.host.updateComplete;

        await ctx.user.keyboard('{Enter}');
        await ctx.host.updateComplete;

        expect(ctx.host.isOpen).toBe(false);
        expect(ctx.host.value).toBe('a');
        expect(ctx.valueInput.value).toBe('a');
        expect(ctx.display.textContent).toContain('Ankara');
    });

    it('selects option via click and closes list', async () => {
        const ctx = await initComboBox(`
			<combo-box field-id="lang" label="Language" placeholder="Pick">
				<option value="js">JavaScript</option>
				<option value="ts">TypeScript</option>
			</combo-box>
		`);

        await openList(ctx);
        const optionDivs = getOptionDivs(ctx.host);
        expect(optionDivs.length).toBe(2);

        await ctx.user.click(optionDivs[1]);
        await ctx.host.updateComplete;

        expect(ctx.host.isOpen).toBe(false);
        expect(ctx.host.value).toBe('ts');
        expect(ctx.display.textContent).toContain('TypeScript');
    });
});

describe('ComboBox - Filtering', () => {
    it('filters options as the user types in search', async () => {
        const ctx = await initComboBox(`
			<combo-box field-id="fruit" label="Fruit" placeholder="Pick">
				<option value="ap">Apple</option>
				<option value="ba">Banana</option>
				<option value="or">Orange</option>
			</combo-box>
		`);

        await openList(ctx);
        await ctx.user.type(ctx.searchInput, 'an');
        await ctx.host.updateComplete;

        const optionDivs = getOptionDivs(ctx.host);
        expect(optionDivs.length).toBe(2);
        expect(optionDivs.map(o => o.textContent.trim().toLowerCase())).toEqual(expect.arrayContaining(['banana', 'orange']));
    });
});

describe('ComboBox - Required validation', () => {
    it('shows required error after interaction when closed without selection', async () => {
        const ctx = await initComboBox(`
			<combo-box field-id="team" label="Team" required placeholder="Pick">
				<option value="a">A</option>
				<option value="b">B</option>
			</combo-box>
		`);

        expect(ctx.host.querySelector('[data-role="error-message"]')).toBeNull();
        expect(ctx.valueInput.getAttribute('aria-errormessage')).toBeNull();

        await openList(ctx); // focuses search => marks as interacted
        await closeListWithEscape(ctx);

        expect(ctx.valueInput.getAttribute('aria-invalid')).toBe('true');
        const error = ctx.host.querySelector('[data-role="error-message"]');
        expect(error).not.toBeNull();
        expect(error.id).toBe('team-error');
        expect(error.hidden).toBe(false);
        expect(error.textContent.trim()).toContain('gereklidir');
        expect(ctx.valueInput.getAttribute('aria-errormessage')).toBe('team-error');
    });

    it('clears error after a valid selection is made', async () => {
        const ctx = await initComboBox(`
			<combo-box field-id="team" label="Team" required placeholder="Pick">
				<option value="a">A</option>
				<option value="b">B</option>
			</combo-box>
		`);

        expect(ctx.host.querySelector('[data-role="error-message"]')).toBeNull();

        await openList(ctx);
        await closeListWithEscape(ctx);
        const error = ctx.host.querySelector('[data-role="error-message"]');
        expect(error).not.toBeNull();

        await openList(ctx);
        const optionDivs = getOptionDivs(ctx.host);
        await ctx.user.click(optionDivs[0]);
        await ctx.host.updateComplete;

        expect(ctx.host.value).toBe('a');
        expect(ctx.valueInput.getAttribute('aria-invalid')).toBeNull();
        expect(ctx.host.querySelector('[data-role="error-message"]')).toBeNull();
        expect(ctx.valueInput.getAttribute('aria-errormessage')).toBeNull();
    });
});

describe('ComboBox - Options property', () => {
    it('accepts options array and renders them', async () => {
        const ctx = await initComboBox('<combo-box field-id="x" label="X" placeholder="Pick"></combo-box>');

        ctx.host.options = ['one', 'two'];
        await ctx.host.updateComplete;

        await openList(ctx);
        const optionDivs = getOptionDivs(ctx.host);
        expect(optionDivs.length).toBe(2);
        expect(optionDivs.map(o => o.getAttribute('data-value'))).toEqual(['one', 'two']);
    });

    it('throws when options is not an array', async () => {
        const { host } = await initComboBox('<combo-box field-id="x" label="X"></combo-box>');
        expect(() => {
            host.options = /** @type {any} */ ('nope');
        }).toThrow(/options must be an array/i);
    });
});
