// Registers Typed UI custom elements for Storybook.
// Guarded to avoid "already defined" errors during HMR.

import { html, render } from 'lit';
import * as TypedUI from '../../dist/typed-ui.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { ifDefined } from '../../src/modules/utilities.js';

defineComponent('check-box', TypedUI.CheckBox);
defineComponent('text-box', TypedUI.TextBox);
defineComponent('plate-box', TypedUI.PlateBox);
defineComponent('select-box', TypedUI.SelectBox);
defineComponent('combo-box', TypedUI.ComboBox);
defineComponent('modal-dialog', TypedUI.ModalDialog);

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

export const Combobox = ({ defaultSlotHtml, noOptionsSlotHtml, fieldId, fieldName, label, value, hideLabel, placeholder, required, disabled, nativeBehavior }) => {
    const temp = html`<combo-box
        field-id=${ifDefined(fieldId)}
        field-name=${ifDefined(fieldName)}
        label=${ifDefined(label)}
        ?hide-label=${hideLabel}
        ?required=${required}
        ?disabled=${disabled}
        ?native-behavior=${nativeBehavior}
        placeholder=${ifDefined(placeholder)}
        value=${ifDefined(value)}
    >
        ${unsafeHTML(noOptionsSlotHtml ?? '')} ${unsafeHTML(defaultSlotHtml ?? '')}
    </combo-box>`;
    // readonly
    return elementFromTemplate(temp);
};

export const Platebox = ({ fieldId, fieldName, label, value, placeholder, required, disabled }) => {
    const temp = html`<plate-box
        field-id=${ifDefined(fieldId)}
        field-name=${ifDefined(fieldName)}
        label=${ifDefined(label)}
        ?required=${required}
        ?disabled=${disabled}
        placeholder=${ifDefined(placeholder)}
        value=${ifDefined(value)}
    >
    </plate-box>`;
    // readonly
    return elementFromTemplate(temp);
};

export const Textbox = ({ fieldId, fieldName, label, value, placeholder, required, disabled }) => {
    const temp = html`<text-box
        field-id=${ifDefined(fieldId)}
        field-name=${ifDefined(fieldName)}
        label=${ifDefined(label)}
        ?required=${required}
        ?disabled=${disabled}
        placeholder=${ifDefined(placeholder)}
        value=${ifDefined(value)}
    >
    </text-box>`;
    // readonly
    return elementFromTemplate(temp);
};

export const Selectbox = ({ defaultSlotHtml, fieldId, fieldName, label, value, placeholder, noOptionsLabel, required, disabled }) => {
    const temp = html`<select-box
        field-id=${ifDefined(fieldId)}
        field-name=${ifDefined(fieldName)}
        label=${ifDefined(label)}
        ?required=${required}
        ?disabled=${disabled}
        placeholder=${ifDefined(placeholder)}
        no-options-label=${ifDefined(noOptionsLabel)}
        value=${ifDefined(value)}
    >
        ${unsafeHTML(defaultSlotHtml ?? '')}
    </select-box>`;
    // readonly
    return elementFromTemplate(temp);
};

export const ModalDialog = ({ defaultSlotHtml, backdropClose, escClose }) => {
    const temp = html`<modal-dialog id="my-modal" ?backdrop-close=${backdropClose} ?esc-close=${escClose}> ${unsafeHTML(defaultSlotHtml ?? '')} </modal-dialog>`;

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
