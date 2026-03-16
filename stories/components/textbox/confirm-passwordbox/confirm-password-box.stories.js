import { Passwordbox, ConfirmPasswordbox } from '../../../utilities/register.js';
import '../textbox/text-box.css';
import '../passwordbox/password-box.css';
import { passwordboxArgTypes } from '../passwordbox/password-box.stories.js';

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
        const passwordInput = Passwordbox({
            id: 'password',
            fieldId: 'password',
            label: 'Şifre',
            placeholder: 'Şifrenizi giriniz',
            required: true,
        });

        const confirmPasswordInput = ConfirmPasswordbox(args);
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
        label: 'Şifre Tekrar',
        placeholder: 'Şifrenizi tekrar giriniz',
        matchSelector: '#password',
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
        },
    },
};
