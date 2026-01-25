import './register.js';

import '../../src/styles/input.css';
import '../../src/styles/select.css';
import '../../src/styles/combo-box.css';

export default {
    title: 'Components/ComboBox',
    tags: ['autodocs'],
};

export const Default = {
    render: () => `
        <combo-box label="Kombo" field-id="combo-country" placeholder="Seçiniz" value="xx" required>
            <template slot="no-options">Kayıtsız</template>
            <option value="tr">Türkiye</option>
            <option value="de">Almanya</option>
            <option value="us">ABD</option>
            <option value="ch" disabled>Çin Halk Cumhuriyeti Çin Halk Cumhuriyeti Çin Halk Cumhuriyeti</option>
            <option value="kp">Kuzey Kore</option>
            <option value="jp">Japonya</option>
            <option value="it">İtalya</option>
        </combo-box>
    `,
};

export const NativeBehavior = {
    render: () => `
        <combo-box label="Kombo Native" field-id="combo-country-native" native-behavior placeholder="Seçiniz" value="de">
            <option value="tr">Türkiye</option>
            <option value="de">Almanya</option>
            <option value="us">ABD</option>
            <option value="ch" disabled>Çin Halk Cumhuriyeti Çin Halk Cumhuriyeti Çin Halk Cumhuriyeti</option>
            <option value="kp">Kuzey Kore</option>
            <option value="jp">Japonya</option>
            <option value="it">İtalya</option>
        </combo-box>
    `,
};

export const DynamicOptionsProperty = {
    render: () => {
        const el = document.createElement('combo-box');
        el.setAttribute('field-id', 'combo-dynamic');
        el.setAttribute('label', 'Kombo Dinamik');
        el.setAttribute('placeholder', 'Seçiniz');

        // Property-driven options (alternative to slotted <option> children)
        el.options = [
            { value: 'tr', label: 'Türkiye' },
            { value: 'de', label: 'Almanya', selected: true },
            { value: 'us', label: 'ABD' },
            { value: 'ch', label: 'Çin Halk Cumhuriyeti', disabled: true },
        ];

        return el;
    },
};
