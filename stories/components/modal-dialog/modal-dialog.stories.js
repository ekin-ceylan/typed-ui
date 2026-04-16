import { createAttrType, createSlotType } from '../../utilities/common-arg-types.js';
import { ModalDialog } from '../../utilities/register.js';
import '../../assets/styles/modal-dialog.css';

export default {
    component: 'modal-dialog',
    title: 'Bileşenler/Dialog Bileşenleri/Modal Dialog',
    argTypes: {
        defaultSlot: createSlotType('Dialog içeriği.', '""', 'default'),
        backdropClose: createAttrType('Backdrop tıklaması ile kapanır.', 'boolean', 'false', false, 'backdrop-close'),
        escClose: createAttrType('ESC tuşu ile kapanır.', 'boolean', 'false', false, 'esc-close'),
    },
};

export const Default = {
    render: args => ModalDialog(args),
    args: {
        defaultSlot: `<p>This is the content of the modal dialog.</p>
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
        defaultSlot: `<h4>This is a modal dialog!</h4>
<div class="modal-body">
    <p>Your awesome modal dialog content goes here.</p>
    <button type="button" onclick="document.getElementById('my-modal').hide()">Kapat</button>
</div>`,
        backdropClose: true,
        escClose: true,
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
        },
    },
};
