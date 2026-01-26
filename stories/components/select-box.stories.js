import '../utilities/register.js';

import '../../src/styles/input.css';
import '../../src/styles/select.css';

export default {
    title: 'Components/SelectBox',
    tags: ['autodocs'],
};

export const Basic = {
    render: () => `
        <select-box field-id="country" label="Ülke" placeholder="Seçiniz" required>
            <option value="tr">Türkiye</option>
            <option value="de">Almanya</option>
            <option value="us">ABD</option>
            <option value="ch">Çin Halk Cumhuriyeti Çin Halk Cumhuriyeti Çin Halk Cumhuriyeti</option>
        </select-box>
    `,
};

export const WithSelectedValue = {
    render: () => `
        <select-box field-id="country-selected" label="Ülke Selected" value="tr" placeholder="Seçiniz" required>
            <span slot="no-options">Kayıtsız</span>
            <option value="tr">Türkiye</option>
            <option value="de">Almanya</option>
            <option value="us">ABD</option>
            <option value="ch" selected>Çin Halk Cumhuriyeti Çin Halk Cumhuriyeti Çin Halk Cumhuriyeti</option>
        </select-box>
    `,
};

export const WithOptGroups = {
    render: () => `
        <select-box field-id="cars" label="Cars">
            <optgroup label="Swedish Cars">
                <option value="volvo" selected>Volvo</option>
                <option value="saab">Saab</option>
            </optgroup>
            <optgroup label="German Cars">
                <option value="mercedes">Mercedes</option>
                <option value="audi">Audi</option>
            </optgroup>
        </select-box>
    `,
};

export const DynamicOptionsProperty = {
    render: () => {
        const el = document.createElement('select-box');
        el.setAttribute('field-id', 'sb-dynamic');
        el.setAttribute('label', 'Dinamik');
        el.setAttribute('placeholder', 'Dinamik Seçiniz');
        el.setAttribute('no-options-label', 'Kayıtsız');

        // Mirrors the dynamic assignment in index.html
        el.options = [
            { value: 'x', label: 'X' },
            { value: 'y', label: 'Y', selected: true },
            { value: 'z', label: 'Z' },
        ];

        return el;
    },
};
