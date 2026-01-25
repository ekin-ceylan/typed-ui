// Registers Typed UI custom elements for Storybook.
// Guarded to avoid "already defined" errors during HMR.

import { html, render } from 'lit';
import * as TypedUI from '../../dist/typed-ui.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { ifDefined } from '../../src/modules/utilities.js';

defineComponent('check-box', TypedUI.CheckBox);
defineComponent('plate-box', TypedUI.PlateBox);
defineComponent('select-box', TypedUI.SelectBox);
defineComponent('combo-box', TypedUI.ComboBox);

export const Checkbox = ({ slotHtml, fieldId, fieldName, label, checkedValue, required, checked, disabled, readonly, indeterminate }) => {
    const temp = html`<check-box
        field-id=${ifDefined(fieldId)}
        field-name=${ifDefined(fieldName)}
        label=${ifDefined(label)}
        checked-value=${ifDefined(checkedValue)}
        ?required=${required}
        ?checked=${checked}
        ?disabled=${disabled}
        ?readonly=${readonly}
        ?indeterminate=${indeterminate}
    >
        ${unsafeHTML(slotHtml ?? '')}
    </check-box>`;

    return elementFromTemplate(temp);
};

function defineComponent(name, constructor) {
    if (!customElements.get(name)) {
        customElements.define(name, constructor);
    }
}

function elementFromTemplate(tpl) {
    try {
        const host = document.createElement('div');
        render(tpl, host);
        const el = host.firstElementChild;
        // ensure rendering is done

        if (!el) throw new Error('Template did not produce a root element.');

        return el;
    } catch (error) {
        return error;
    }
}
