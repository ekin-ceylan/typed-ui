export const inputBaseArgTypes = {
    fieldId: {
        name: 'field-id',
        type: { name: 'string' },
        control: 'text',
        description: 'Input elementinin `id` özniteliğini belirler. Eğer belirtilmezse, otomatik olarak bir değer atanır.',
        table: {
            category: 'Attributes',
            defaultValue: { summary: '' },
        },
    },
    fieldName: {
        name: 'field-name',
        type: { name: 'string' },
        control: 'text',
        description: 'Input elementinin `name` özniteliğini belirler. Alanın, arka uçtaki ismi yazılmalıdır. Boş bırakılırsa, inputun değeri form ile gönderilmez.',
        table: {
            category: 'Attributes',
            defaultValue: { summary: 'field-id' },
        },
    },
    inputClass: {
        name: 'input-class',
        type: { name: 'string' },
        defaultValue: undefined,
        description: 'İçteki `<input>` veya `<select>` elementine uygulanacak CSS sınıfı.',
        control: 'text',
        table: {
            category: 'Attributes',
            defaultValue: { summary: 'null' },
            type: { summary: 'string' },
        },
    },
    value: {
        type: { name: 'string' },
        defaultValue: undefined,
        description: 'Inputun tuttuğu değer.',
        control: 'text',
        table: {
            category: 'Attributes',
            defaultValue: { summary: 'null' },
            type: { summary: 'string' },
        },
    },
    label: {
        type: { name: 'string', required: true },
        control: 'text',
        description: 'Input etiketi',
        table: {
            category: 'Attributes',
            defaultValue: { summary: '' },
        },
    },
    hideLabel: {
        name: 'hide-label',
        control: 'boolean',
        description: 'Label etiketinin render edilmez. `aria-label` olarak kullanılır.',
        table: {
            category: 'Attributes',
            defaultValue: { summary: 'false' },
            type: { summary: 'boolean' },
        },
    },
    required: {
        control: 'boolean',
        description: 'Inputun doldurulmasının zorunlu olup olmadığını belirler ve `valueMissing` durumunu etkiler.',
        table: {
            category: 'Attributes',
            defaultValue: { summary: 'false' },
            type: { summary: 'boolean' },
        },
    },
    disabled: {
        control: 'boolean',
        description: 'Inputun devre dışı olup olmadığını belirler. Devre dışıysa, input etkileşime kapatılır ve form ile gönderilmez.',
        table: {
            category: 'Attributes',
            defaultValue: { summary: 'false' },
            type: { summary: 'boolean' },
        },
    },
    placeholder: {
        type: { name: 'string' },
        control: 'text',
        description: 'Değer boşken gösterilecek yer tutucu metin.',
        table: {
            category: 'Attributes',
            defaultValue: { summary: '' },
        },
    },
    requiredSign: {
        name: 'required-sign',
        type: { name: 'string' },
        control: 'text',
        description: 'Zorunlu alanlar için input etiketine eklenecek işaret.',
        table: {
            category: 'Attributes',
            defaultValue: { summary: '' },
        },
    },
    clearable: {
        control: 'boolean',
        description: 'Açıksa, "İçeriği Temizle" butonu gösterilir.',
        table: {
            category: 'Attributes',
            defaultValue: { summary: 'false' },
            type: { summary: 'boolean' },
        },
    },
    readonly: {
        control: 'boolean',
        description: 'Inputun salt okunur olup olmadığını belirler. Salt okunursa, input etkileşime kapatılır ancak form ile gönderilir.',
        table: {
            category: 'Attributes',
            defaultValue: { summary: 'false' },
            type: { summary: 'boolean' },
        },
    },
};

export const textBoxArgTypes = {
    ...inputBaseArgTypes,
    type: {
        control: 'text',
        description: 'Inputun türünü belirler. Örneğin, `text`, `email`, `password` gibi.',
        table: {
            category: 'Attributes',
            defaultValue: { summary: 'text' },
            type: { summary: 'string' },
        },
    },
    allowPattern: {
        name: 'allow-pattern',
        control: 'text',
        description: 'Maskeleme sırasında izin verilecek karakterleri belirleyen RegExp kaynak metni. Belirtilmezse filtre uygulanmaz.',
        table: {
            category: 'Attributes',
            defaultValue: { summary: 'undefined' },
            type: { summary: 'string' },
        },
    },
    pattern: {
        control: 'text',
        description: 'Input doğrulaması için kullanılacak RegExp kaynak metni. Belirtilirse `patternMismatch` benzeri kontrol yapılır.',
        table: {
            category: 'Attributes',
            defaultValue: { summary: 'undefined' },
            type: { summary: 'string' },
        },
    },
    inputmode: {
        control: 'text',
        description: 'Inputun beklediği veri türünü belirtir ve mobil cihazlarda uygun klavyenin gösterilmesini sağlar. Örneğin, `text`, `numeric`, `decimal`, `email` gibi.',
        table: {
            category: 'Attributes',
            defaultValue: { summary: 'text' },
            type: { summary: 'string' },
        },
    },
    minlength: {
        control: 'number',
        description: 'Inputun içermesi gereken en az karakter sayısını belirtir. Koşul sağlanmazsa, `tooShort` validasyon durumunu tetikler.',
        table: {
            category: 'Attributes',
            defaultValue: { summary: 'undefined' },
            type: { summary: 'number' },
        },
    },
    maxlength: {
        control: 'number',
        description: 'Inputun içerebileceği karakter sayısını belirtir. Fazla karakter girişi engellenir.',
        table: {
            category: 'Attributes',
            defaultValue: { summary: 'undefined' },
            type: { summary: 'number' },
        },
    },
    autocomplete: {
        control: 'text',
        description: 'Inputun otomatik tamamlama özelliğini belirler. Örneğin, `on`, `off` gibi.',
        defaultValue: undefined,
        table: {
            category: 'Attributes',
            defaultValue: { summary: 'undefined' },
            type: { summary: 'string' },
        },
    },
    autounmask: {
        control: 'boolean',
        description:
            'Bileşenin değerinin maskeli şekilde tutulup tutulmayacağını belirler. Açıksa, inputun görünen değeri maskelenirken bileşenin tuttuğu değer maskesiz olur. `unmask()` fonksiyonu tanımlanmış olmalıdır.',
        defaultValue: false,
        table: {
            category: 'Attributes',
            defaultValue: { summary: 'false' },
            type: { summary: 'boolean' },
        },
    },
    spellcheck: {
        control: 'boolean',
        description: 'Tarayıcının inputun değeri için yazım denetimi yapıp yapmayacağını belirler.',
        defaultValue: undefined,
        table: {
            category: 'Attributes',
            defaultValue: { summary: 'undefined' },
            type: { summary: 'boolean' },
        },
    },
};

export const codeBoxArgTypes = {
    ...textBoxArgTypes,
    placeholder: {
        type: { name: 'string' },
        control: 'text',
        description: 'Seçim yapılmamışken gösterilecek yer tutucu metin.',
        table: {
            category: 'Attributes',
            defaultValue: { summary: '_' },
        },
    },
    digits: {
        type: { name: 'number' },
        defaultValue: 1,
        description: "Inputun kaç haneli olduğunu belirler. `1`'den küçük veya geçersiz bir değer verilirse, `1` olarak atanır.",
        control: 'number',
        table: {
            category: 'Attributes',
            defaultValue: { summary: 1 },
            type: { summary: 'number' },
        },
    },
};
