import { ModalDialog } from '../../utilities/register.js';
import './modal-dialog.css';

export default {
    component: 'modal-dialog',
    title: 'Components/Modal Dialog',
    argTypes: {
        default: {
            control: 'text',
            description: 'Dialog içeriği.',
            table: {
                category: 'Slots',
                type: { summary: 'html' },
                defaultValue: { summary: '' },
            },
        },
        closeButtonIcon: {
            name: 'close-button-icon',
            control: 'text',
            description: 'Kapatma butonunun ikonu içeriği (opsiyonel).',
            table: {
                category: 'Slots',
                type: { summary: 'html' },
                defaultValue: { summary: '&times;' },
            },
        },
        backdropClose: {
            name: 'backdrop-close',
            control: 'boolean',
            description: 'Backdrop tıklaması ile kapanır',
            table: {
                category: 'Attributes',
                defaultValue: { summary: 'false' },
                type: { summary: 'boolean' },
            },
        },
        escClose: {
            name: 'esc-close',
            control: 'boolean',
            description: 'ESC tuşu ile kapanır',
            table: {
                category: 'Attributes',
                defaultValue: { summary: 'false' },
                type: { summary: 'boolean' },
            },
        },
    },
};

export const Default = {
    render: args => ModalDialog(args),
    args: {
        default: `<p>This is the content of the modal dialog.</p>
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
        button.setAttribute('onclick', "document.getElementById('my-modal').show()");

        // Container div oluştur
        const container = document.createElement('div');
        container.appendChild(button);
        container.appendChild(document.createComment(' MODAL DIALOG '));
        container.appendChild(modal);
        container.appendChild(document.createComment(' MODAL DIALOG '));

        return container;
    },
    tags: ['!dev'],
    args: {
        default: `<h4>This is a modal dialog!</h4>
<div class="modal-body">
    <p>Your awesome modal dialog content goes here.</p>
    <button type="button" onclick="document.getElementById('my-modal').hide()">Kapat</button>
</div>`,
        closeButtonIcon: `<svg width="16" height="16" slot="close-button-icon" aria-hidden="true" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <line x1="4" y1="4" x2="12" y2="12" stroke="currentColor" stroke-width="2"/>
    <line x1="12" y1="4" x2="4" y2="12" stroke="currentColor" stroke-width="2"/>
</svg>`,
        backdropClose: true,
        escClose: true,
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
        },
    },
};
