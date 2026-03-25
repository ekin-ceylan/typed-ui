export const inputBaseArgTypes = {
    fieldId: createAttrType('Input elementinin `id` özniteliğini belirler. Eğer belirtilmezse, otomatik olarak bir değer atanır.', 'string', '""', false, 'field-id'),
    fieldName: createAttrType(
        'Input elementinin `name` özniteliğini belirler. Alanın, arka uçtaki ismi yazılmalıdır. Boş bırakılırsa, inputun değeri form ile gönderilmez.',
        'string',
        '""',
        false,
        'field-name'
    ),
    inputClass: createAttrType('İçteki `<input>` veya `<select>` elementine uygulanacak CSS sınıfı.', 'string', 'null', false, 'input-class'),
    value: createAttrType('Inputun tuttuğu değer.', 'string', 'null'),
    label: createAttrType('Input etiketi', 'string', '""', true),
    hideLabel: createAttrType('Label etiketinin render edilmez. `aria-label` olarak kullanılır.', 'boolean', 'false', false, 'hide-label'),
    required: createAttrType('Inputun doldurulmasının zorunlu olup olmadığını belirler ve `valueMissing` durumunu etkiler.', 'boolean', 'false'),
    disabled: createAttrType('Inputun devre dışı olup olmadığını belirler. Devre dışıysa, input etkileşime kapatılır ve form ile gönderilmez.', 'boolean', 'false'),
    placeholder: createAttrType('Değer boşken gösterilecek yer tutucu metin.', 'string', '""'),
    requiredSign: createAttrType('Zorunlu alanlar için input etiketine eklenecek işaret.', 'string', '""', false, 'required-sign'),
    clearable: createAttrType('Açıksa, "İçeriği Temizle" butonu gösterilir.', 'boolean', 'false'),
    readonly: createAttrType('Inputun salt okunur olup olmadığını belirler. Salt okunursa, input etkileşime kapatılır ancak form ile gönderilir.', 'boolean', 'false'),
};

export const textBoxArgTypes = {
    ...inputBaseArgTypes,
    type: createAttrType('Inputun türünü belirler. Örneğin, `text`, `email`, `password` gibi.', 'string', 'text'),
    allowPattern: createAttrType(
        'Maskeleme sırasında izin verilecek karakterleri belirleyen RegExp kaynak metni. Belirtilmezse filtre uygulanmaz.',
        'string',
        'undefined',
        false,
        'allow-pattern'
    ),
    pattern: createAttrType('Input doğrulaması için kullanılacak RegExp kaynak metni. Belirtilirse `patternMismatch` benzeri kontrol yapılır.', 'string', 'undefined'),
    inputmode: createAttrType(
        'Inputun beklediği veri türünü belirtir ve mobil cihazlarda uygun klavyenin gösterilmesini sağlar. Örneğin, `text`, `numeric`, `decimal`, `email` gibi.',
        'string',
        'text'
    ),
    minlength: createAttrType('Inputun içermesi gereken en az karakter sayısını belirtir. Koşul sağlanmazsa, `tooShort` validasyon durumunu tetikler.', 'number', 'undefined'),
    maxlength: createAttrType('Inputun içerebileceği karakter sayısını belirtir. Fazla karakter girişi engellenir.', 'number', 'undefined'),
    autocomplete: createAttrType('Inputun otomatik tamamlama özelliğini belirler. Örneğin, `on`, `off` gibi.', 'string', 'undefined'),
    autounmask: createAttrType(
        'Bileşenin değerinin maskeli şekilde tutulup tutulmayacağını belirler. Açıksa, inputun görünen değeri maskelenirken bileşenin tuttuğu değer maskesiz olur. `unmask()` fonksiyonu tanımlanmış olmalıdır.',
        'boolean',
        'false'
    ),
    spellcheck: createAttrType('Tarayıcının inputun değeri için yazım denetimi yapıp yapmayacağını belirler.', 'boolean', 'undefined'),
};

export const passwordboxArgTypes = {
    ...structuredClone(inputBaseArgTypes),
    pattern: textBoxArgTypes.pattern,
    allowPattern: textBoxArgTypes.allowPattern,
    maxlength: textBoxArgTypes.maxlength,
    minlength: textBoxArgTypes.minlength,
    revealed: {
        control: 'boolean',
        description: 'Şifrenin görünür olup olmadığını belirler. Varsa şifre görünür.',
        table: {
            category: 'Attributes',
            defaultValue: { summary: 'false' },
            type: { summary: 'boolean' },
        },
    },
};

export const paginationArgTypes = {
    currentPage: createAttrType('Aktif sayfa numarası.', 'number', '1', false, 'current-page'),
    pageCount: createAttrType('Toplam sayfa sayısı.', 'number', '1', false, 'page-count'),
    siblingCount: createAttrType('Aktif sayfanın yanındaki sayfa sayısı.', 'number', '2', false, 'sibling-count'),
    ariaLabel: createAttrType('Sayfalama bileşeni için ARIA etiketi.', 'string', 'Pagination', false, 'aria-label'),
};

/**
 * @param {string} description
 * @param {string} type
 * @param {string} defaultValue
 * @param {boolean} isRequired
 * @param {string} name
 */
export function createAttrType(description, type, defaultValue, isRequired, name) {
    const desc = `${description} \n\n Type: \`${type}\`, Default: \`${defaultValue}\``;

    return {
        name,
        description: desc,
        type: { name: type, required: isRequired },
        control: ['string', 'html'].includes(type) ? 'text' : type,
        table: {
            category: 'Attributes',
            defaultValue: { summary: defaultValue },
        },
    };
}

export function createSlotType(description, defaultValue, name) {
    const type = 'html';
    const desc = `${description} \n\n Type: \`${type}\` Default: \`${defaultValue}\``;

    return {
        name,
        description: desc,
        type: { name: type },
        control: 'text',
        table: {
            category: 'Slots',
            defaultValue: { summary: defaultValue },
        },
    };
}
