import { createForm, Selectbox } from '../../utilities/register.js';
import './select-box.css';

export default {
    title: 'Components/Select',
    argTypes: {
        default: {
            control: 'text',
            description: 'options için slot içeriği.',
            table: {
                category: 'Slots',
                type: { summary: 'html' },
                defaultValue: { summary: '' },
            },
        },
        fieldId: {
            name: 'field-id',
            type: { name: 'string', required: true },
            control: 'text',
            description: 'İçteki `<select>` elementinin `id` değeri. Label ilişkilendirmesi ve hata mesajı id’leri için kullanılır.',
            table: {
                category: 'Attributes',
                defaultValue: { summary: '' },
            },
        },
        fieldName: {
            name: 'field-name',
            type: { name: 'string' },
            control: 'text',
            description: "`<select>` elementinin `name` değeri. Form submit'inde gönderilecek alan adı. Atanmazsa `field-id` değeri kullanılır.",
            table: {
                category: 'Attributes',
                defaultValue: { summary: 'field-id' },
            },
        },
        label: {
            type: { name: 'string', required: true },
            control: 'text',
            description: 'Görsel label metni. `required` ise otomatik `*` eklenir.',
            table: {
                category: 'Attributes',
                defaultValue: { summary: '' },
            },
        },
        hideLabel: {
            name: 'hide-label',
            type: { name: 'boolean' },
            control: 'boolean',
            description: "Label'ı görsel olarak gizler; erişilebilirlik için `aria-label` kullanılır.",
            table: {
                category: 'Attributes',
                defaultValue: { summary: false },
            },
        },
        inputClass: {
            name: 'input-class',
            type: { name: 'string' },
            control: 'text',
            description: 'İçteki `<select>` elementine uygulanacak CSS sınıfı.',
            table: {
                category: 'Attributes',
                defaultValue: { summary: '' },
            },
        },
        value: {
            type: { name: 'string' },
            defaultValue: undefined,
            description: 'Seçili değeri kontrol eder. Başlangıçta verilen değer option’lar arasında varsa seçili gelir.',
            control: 'text',
            table: {
                category: 'Attributes',
                defaultValue: { summary: 'null' },
                type: { summary: 'string|number' },
            },
        },
        required: {
            control: 'boolean',
            description: 'Seçim zorunlu hale gelir; seçim yoksa doğrulama mesajı gösterir ve form submit’ini engeller.',
            table: {
                category: 'Attributes',
                defaultValue: { summary: 'false' },
                type: { summary: 'boolean' },
            },
        },
        disabled: {
            control: 'boolean',
            description: 'Bileşeni devre dışı bırakır ve kullanıcı etkileşimini engeller. Submit edildiğinde değeri göndermez.',
            table: {
                category: 'Attributes',
                defaultValue: { summary: 'false' },
                type: { summary: 'boolean' },
            },
        },
        placeholder: {
            type: { name: 'string' },
            control: 'text',
            description: 'Seçim yapılmamışken görünen metin (ilk *hidden* ve *disabled* option olarak render edilir).',
            table: {
                category: 'Attributes',
                defaultValue: { summary: '' },
            },
        },
        noOptionsLabel: {
            name: 'no-options-label',
            type: { name: 'string' },
            control: 'text',
            description: 'Seçenek yokken listede gösterilen metin.',
            table: {
                category: 'Attributes',
                defaultValue: { summary: 'Kayıt Bulunamadı' },
            },
        },
        // readonly: {
        //     control: 'boolean',
        //     table: {
        //         defaultValue: { summary: 'false' },
        //         type: { summary: 'boolean' },
        //     },
        // },
    },
};

export const PlaygroundStory = {
    render: args => Selectbox(args),
    tags: ['!dev'],
    args: {
        default: `<option value="tr">Türkiye</option>
<option value="de">Almanya</option>
<option value="us" selected>ABD</option>
<option value="ch" disabled>Çin Halk Cumhuriyeti</option>
<option value="kp">Kuzey Kore</option>
<option value="jp">Japonya</option>
<option value="it">İtalya</option>`,
        fieldId: 'country',
        label: 'Ülke',
        placeholder: 'Lütfen seçiniz',
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
        },
    },
};

export const BasicSlotUsage = {
    render: args => Selectbox(args),
    tags: ['!dev'],
    args: {
        default: `<option value="tr">Türkiye</option>
<option value="de">Almanya</option>
<option value="us">ABD</option>
<option value="kp" disabled>Kuzey Kore</option>
<option value="jp">Japonya</option>
<option value="it">İtalya</option>`,
        fieldId: 'country',
        label: 'Ülke',
        placeholder: 'Lütfen seçiniz',
        id: 'basic-select',
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
        },
    },
};

export const OptGroupSlotUsage = {
    render: args => Selectbox(args),
    tags: ['!dev'],
    args: {
        default: `<optgroup label="German Cars">
    <option value="audi">Audi</option>
    <option value="bmw">BMW</option>
</optgroup>
<optgroup label="Swedish Cars">
    <option value="volvo">Volvo</option>
    <option value="saab">Saab</option>
</optgroup>`,
        fieldId: 'country',
        label: 'Ülke',
        placeholder: 'Lütfen seçiniz',
        id: 'basic-select',
    },
};

export const BasicSelectedUsage = {
    render: args => Selectbox(args),
    tags: ['!dev'],
    args: {
        default: `<option value="tr">Türkiye</option>
<option value="de">Almanya</option>
<option value="us">ABD</option>
<option value="jp">Japonya</option>`,
        fieldId: 'country',
        label: 'Ülke',
        placeholder: 'Lütfen seçiniz',
        value: 'de',
    },
};

export const ValidationUsage = {
    render: args => {
        const selectbox = Selectbox(args);
        return createForm(selectbox, 'SELECTBOX');
    },
    tags: ['!dev'],
    args: {
        default: `<option value="tr">Türkiye</option>
<option value="de">Almanya</option>
<option value="us">ABD</option>`,
        fieldId: 'country',
        label: 'Ülke',
        placeholder: 'Lütfen seçiniz',
        required: true,
    },
};

export const PropAttrEventLists = {
    tags: ['!dev'],
    argTypes: {
        // 3. Events (İstersen bunları da elle ekleyebilirsin)
        input: {
            action: 'input', // Actions panelinde 'input' ismiyle loglar
            description: 'Kullanıcı listeden bir seçim yaptığında (anlık) tetiklenir.',
            table: {
                category: 'Events',
                type: { summary: 'CustomEvent' }, // Tip sütununda görünür
            },
        },
        change: {
            action: 'change',
            description: 'Değer commit edildiğinde (Seçim tamamlandığında veya temizlendiğinde) tetiklenir.',
            table: {
                category: 'Events',
                type: { summary: 'CustomEvent' },
            },
        },
        clear: {
            action: 'clear',
            description: 'Temizleme (X) butonuna tıklandığında tetiklenir.',
            table: {
                category: 'Events',
                type: { summary: 'CustomEvent' },
            },
        },
        update: {
            action: 'update',
            description: 'Değer programatik olarak (JS ile .value set edilerek) değiştirildiğinde tetiklenir.',
            control: false, // Bu bir event olduğu için kontrol edilemez
            table: {
                category: 'Events',
                type: { summary: 'CustomEvent' },
            },
        },
    },
};
