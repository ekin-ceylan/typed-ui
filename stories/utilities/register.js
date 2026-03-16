// Registers Typed UI custom elements for Storybook.
// Guarded to avoid "already defined" errors during HMR.

import { html, render } from 'lit';
import * as TypedUI from '../../dist/typed-ui.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { ifDefined, isEmpty } from '../../src/modules/utilities.js';

defineComponent('check-box', TypedUI.CheckBox);
defineComponent('text-box', TypedUI.TextBox);
defineComponent('tc-box', TypedUI.TcBox);
defineComponent('code-box', TypedUI.CodeBox);
defineComponent('plate-box', TypedUI.PlateBox);
defineComponent('phone-box', TypedUI.PhoneBox);
defineComponent('email-box', TypedUI.EmailBox);
defineComponent('password-box', TypedUI.PasswordBox);
defineComponent('confirm-password-box', TypedUI.ConfirmPasswordBox);
defineComponent('select-box', TypedUI.SelectBox);
defineComponent('combo-box', TypedUI.ComboBox);
defineComponent('modal-dialog', TypedUI.ModalDialog);

export const Checkbox = ({ defaultSlot, fieldId, fieldName, label, checkedValue, required, checked, disabled, readonly, indeterminate }) => {
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
        ${unsafeHTML(defaultSlot ?? '')}
    </check-box>`;

    return elementFromTemplate(temp);
};

export const Combobox = args => {
    const temp = html`<combo-box
        field-id=${ifDefined(args.fieldId)}
        field-name=${ifDefined(args.fieldName)}
        label=${ifDefined(args.label)}
        ?hide-label=${args.hideLabel}
        ?required=${args.required}
        ?clearable=${args.clearable}
        ?disabled=${args.disabled}
        ?native-behavior=${args.nativeBehavior}
        placeholder=${ifDefined(args.placeholder)}
        value=${ifDefined(args.value)}
        required-sign=${ifDefined(args.requiredSign)}
    >
        ${unsafeHTML(args.noOptionsSlot ?? '')} ${unsafeHTML(args.defaultSlot ?? '')}
    </combo-box>`;

    return elementFromTemplate(temp);
};

export const Platebox = args => {
    const temp = `<plate-box ${getAttrs(args)}> </plate-box>`;
    return elementFromText(temp);
};

export const Phonebox = args => {
    const temp = `<phone-box ${getAttrs(args)}> </phone-box>`;
    return elementFromText(temp);
};

export const Textbox = args => {
    const temp = `<text-box ${getAttrs(args)}> </text-box>`;
    return elementFromText(temp);
};

export const TcBox = args => {
    const temp = `<tc-box ${getAttrs(args)}> </tc-box>`;
    return elementFromText(temp);
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

    return elementFromTemplate(temp);
};

export const Emailbox = args => {
    const temp = `<email-box ${getAttrs(args)}> </email-box>`;
    return elementFromText(temp);
};

export const Passwordbox = args => {
    const temp = `<password-box ${getAttrs(args)}> </password-box>`;
    return elementFromText(temp);
};

export const ConfirmPasswordbox = args => {
    const temp = `<confirm-password-box ${getAttrs(args)}> </confirm-password-box>`;
    return elementFromText(temp);
};

export const Selectbox = args => {
    const temp = html`<select-box
        id=${ifDefined(args.id)}
        field-id=${ifDefined(args.fieldId)}
        field-name=${ifDefined(args.fieldName)}
        label=${ifDefined(args.label)}
        ?required=${args.required}
        ?disabled=${args.disabled}
        ?clearable=${args.clearable}
        placeholder=${ifDefined(args.placeholder)}
        no-options-label=${ifDefined(args.noOptionsLabel)}
        value=${ifDefined(args.value)}
        required-sign=${ifDefined(args.requiredSign)}
    >
        ${unsafeHTML(args.defaultSlot ?? '')}
    </select-box>`;

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

function elementFromText(htmlString) {
    const template = document.createElement('template');
    template.innerHTML = htmlString.trim();
    return template.content.firstElementChild;
}

function pascalToKebab(str) {
    return str.replaceAll(/([A-Z])/g, '-$1').toLowerCase();
}

function getAttrs(args) {
    return Object.entries(args)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => {
            const attr = pascalToKebab(k);
            return addIfDefined(attr, v);
        })
        .join(' ');
}

function addIfDefined(name, value) {
    if (value === true) return name;
    return isEmpty(value) || value === false ? '' : `${name}="${value}"`;
}
