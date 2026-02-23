// Registers Typed UI custom elements for Storybook.
// Guarded to avoid "already defined" errors during HMR.

import { html, render } from 'lit';
import * as TypedUI from '../../dist/typed-ui.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { ifDefined } from '../../src/modules/utilities.js';

defineComponent('check-box', TypedUI.CheckBox);
defineComponent('text-box', TypedUI.TextBox);
defineComponent('tc-box', TypedUI.TcBox);
defineComponent('code-box', TypedUI.CodeBox);
defineComponent('plate-box', TypedUI.PlateBox);
defineComponent('phone-box', TypedUI.PhoneBox);
defineComponent('email-box', TypedUI.EmailBox);
defineComponent('password-box', TypedUI.PasswordBox);
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

export const Combobox = ({ defaultSlot, noOptionsSlot, fieldId, fieldName, label, value, hideLabel, placeholder, required, disabled, nativeBehavior }) => {
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
        ${unsafeHTML(noOptionsSlot ?? '')} ${unsafeHTML(defaultSlot ?? '')}
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

export const Phonebox = ({ fieldId, fieldName, label, value, placeholder, required, disabled }) => {
    const temp = html`<phone-box
        field-id=${ifDefined(fieldId)}
        field-name=${ifDefined(fieldName)}
        label=${ifDefined(label)}
        ?required=${required}
        ?disabled=${disabled}
        placeholder=${ifDefined(placeholder)}
        value=${ifDefined(value)}
    >
    </phone-box>`;
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

export const TcBox = ({ fieldId, fieldName, label, value, placeholder, required, disabled }) => {
    const temp = html`<tc-box
        field-id=${ifDefined(fieldId)}
        field-name=${ifDefined(fieldName)}
        label=${ifDefined(label)}
        ?required=${required}
        ?disabled=${disabled}
        placeholder=${ifDefined(placeholder)}
        value=${ifDefined(value)}
    >
    </tc-box>`;
    // readonly
    return elementFromTemplate(temp);
};

export const CodeBox = ({ fieldId, fieldName, label, value, placeholder, digits, required, disabled }) => {
    const temp = html`<code-box
        field-id=${ifDefined(fieldId)}
        field-name=${ifDefined(fieldName)}
        label=${ifDefined(label)}
        ?required=${required}
        ?disabled=${disabled}
        placeholder=${ifDefined(placeholder)}
        value=${ifDefined(value)}
        digits=${ifDefined(digits)}
    >
    </code-box>`;
    // readonly
    return elementFromTemplate(temp);
};

export const Emailbox = ({ fieldId, fieldName, label, value, placeholder, required, disabled }) => {
    const temp = html`<email-box
        field-id=${ifDefined(fieldId)}
        field-name=${ifDefined(fieldName)}
        label=${ifDefined(label)}
        ?required=${required}
        ?disabled=${disabled}
        placeholder=${ifDefined(placeholder)}
        value=${ifDefined(value)}
    >
    </email-box>`;
    // readonly
    return elementFromTemplate(temp);
};

export const Passwordbox = ({ fieldId, fieldName, label, value, placeholder, required, disabled }) => {
    const temp = html`<password-box
        field-id=${ifDefined(fieldId)}
        field-name=${ifDefined(fieldName)}
        label=${ifDefined(label)}
        ?required=${required}
        ?disabled=${disabled}
        placeholder=${ifDefined(placeholder)}
        value=${ifDefined(value)}
    >
    </password-box>`;
    // readonly
    return elementFromTemplate(temp);
};

export const Selectbox = ({ default: defaultSlot, id, fieldId, fieldName, label, value, placeholder, noOptionsLabel, required, disabled }) => {
    const temp = html`<select-box
        id=${ifDefined(id)}
        field-id=${ifDefined(fieldId)}
        field-name=${ifDefined(fieldName)}
        label=${ifDefined(label)}
        ?required=${required}
        ?disabled=${disabled}
        placeholder=${ifDefined(placeholder)}
        no-options-label=${ifDefined(noOptionsLabel)}
        value=${ifDefined(value)}
    >
        ${unsafeHTML(defaultSlot ?? '')}
    </select-box>`;
    // readonly
    return elementFromTemplate(temp);
};

export const ModalDialog = ({ default: defaultSlot, closeButtonIcon, backdropClose, escClose }) => {
    const temp = html`<modal-dialog id="my-modal" ?backdrop-close=${backdropClose} ?esc-close=${escClose}>
        ${unsafeHTML(closeButtonIcon ?? '')} ${unsafeHTML(defaultSlot ?? '')}
    </modal-dialog>`;

    return elementFromTemplate(temp);
};

export const createForm = (mainElement, elementComment) => {
    const button = document.createElement('button');
    button.type = 'submit';
    button.style.margin = '22px 10px 0 0';
    button.textContent = 'Gönder';

    const span = document.createElement('span');

    const form = document.createElement('form');
    form.appendChild(document.createComment(` ${elementComment} `));
    form.appendChild(mainElement);
    form.appendChild(document.createComment(` ${elementComment} `));
    form.appendChild(button);
    form.appendChild(span);

    form.addEventListener('submit', event => {
        event.preventDefault();
        const formData = new FormData(form);
        const entries = Array.from(formData.entries())
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n');
        span.textContent = `Form submitted with data:\n${entries}`;
    });

    return form;
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
