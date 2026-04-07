import { NewPasswordbox, ConfirmPasswordbox } from '../../../utilities/register.js';
import '../../../assets/styles/text-box.css';
import '../passwordbox/password-box.css';
import { passwordboxArgTypes } from '../../../utilities/common-arg-types.js';

const argTypes = {
    ...structuredClone(passwordboxArgTypes),
    matchSelector: {
        name: 'match-selector',
        control: 'text',
        description: 'Eşleşmesi gereken input elementi için CSS seçici. Örneğin, `#password`.',
        table: {
            category: 'Attributes',
            defaultValue: { summary: 'undefined' },
            type: { summary: 'string' },
        },
    },
};

export default {
    title: 'Bileşenler/Textbox/ConfirmPasswordBox',
    argTypes,
};

// Mirrors index.html:
// <plate-box field-id="plate-no" label="Plaka Numarası" value="55  ty" required></plate-box>
export const Default = {
    render: args => ConfirmPasswordbox(args),
    args: {
        fieldId: 'password',
        label: 'Şifre',
        placeholder: 'Şifrenizi giriniz',
        required: true,
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
        const confirmPasswordInput = ConfirmPasswordbox(args);
        const passwordInput = NewPasswordbox({
            id: 'new-password',
            fieldId: 'newPassword',
            label: 'Yeni Şifre',
            placeholder: 'Yeni şifrenizi giriniz',
            required: true,
        });

        const button = document.createElement('button');
        button.type = 'submit';
        button.textContent = 'Gönder';

        const container = document.createElement('form');
        container.appendChild(passwordInput);
        container.appendChild(document.createElement('br')); // İki input arasında boşluk
        container.appendChild(confirmPasswordInput);
        container.appendChild(document.createElement('br')); // İki input arasında boşluk
        container.appendChild(button);

        return container;
    },
    tags: ['!dev'],
    args: {
        label: 'Yeni Şifre Tekrar',
        placeholder: 'Yeni şifrenizi tekrar giriniz',
        matchSelector: '#new-password',
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
        },
    },
};
