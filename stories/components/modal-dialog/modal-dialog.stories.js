import { ModalDialog } from '../../utilities/register.js';
import './modal-dialog.css';

export default {
    component: 'modal-dialog',
    title: 'Components/ModalDialog',
    argTypes: {
        defaultSlotHtml: {
            control: 'text',
            description: 'Dialog içeriği.',
            table: {
                type: { summary: 'html' },
                defaultValue: { summary: '' },
            },
        },
        backdropClose: {
            control: 'boolean',
            description: 'Backdrop tıklaması ile kapanır',
            table: {
                defaultValue: { summary: 'false' },
                type: { summary: 'boolean' },
            },
        },
        escClose: {
            control: 'boolean',
            description: 'ESC tuşu ile kapanır',
            table: {
                defaultValue: { summary: 'false' },
                type: { summary: 'boolean' },
            },
        },
    },
};

export const Default = {
    render: args => ModalDialog(args),
    args: {
        defaultSlotHtml: `<p>This is the content of the modal dialog.</p>
<button type="button" onclick="document.getElementById('my-modal').hide()">Close</button>`,
        backdropClose: true,
        escClose: true,
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
            codePanel: true,
        },
    },
};

export const PlaygroundStory = {
    render: args => {
        const modal = ModalDialog(args);

        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = 'Modalı Aç';
        button.style.marginRight = '12px';
        button.setAttribute('onclick', "document.getElementById('my-modal').show()");

        // Container div oluştur
        const container = document.createElement('div');
        container.appendChild(button);
        container.appendChild(modal);

        return container;
    },
    tags: ['!dev'],
    args: {
        defaultSlotHtml: `<p>This is the content of the modal dialog.</p>
<button type="button" onclick="document.getElementById('my-modal').hide()">Close</button>`,
        backdropClose: true,
        escClose: true,
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
        },
    },
};

// export const NativeBehavior = {
//     render: () => `
//         <combo-box label="Kombo Native" field-id="combo-country-native" native-behavior placeholder="Seçiniz" value="de">
//             <option value="tr">Türkiye</option>
//             <option value="de">Almanya</option>
//             <option value="us">ABD</option>
//             <option value="ch" disabled>Çin Halk Cumhuriyeti Çin Halk Cumhuriyeti Çin Halk Cumhuriyeti</option>
//             <option value="kp">Kuzey Kore</option>
//             <option value="jp">Japonya</option>
//             <option value="it">İtalya</option>
//         </combo-box>
//     `,
// };

// export const DynamicOptionsProperty = {
//     render: () => {
//         const el = document.createElement('combo-box');
//         el.setAttribute('field-id', 'combo-dynamic');
//         el.setAttribute('label', 'Kombo Dinamik');
//         el.setAttribute('placeholder', 'Seçiniz');

//         // Property-driven options (alternative to slotted <option> children)
//         el.options = [
//             { value: 'tr', label: 'Türkiye' },
//             { value: 'de', label: 'Almanya', selected: true },
//             { value: 'us', label: 'ABD' },
//             { value: 'ch', label: 'Çin Halk Cumhuriyeti', disabled: true },
//         ];

//         return el;
//     },
// };
