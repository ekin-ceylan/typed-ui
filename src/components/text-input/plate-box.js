import TextBase from '../../core/text-base';

export default class PlateBox extends TextBase {
    static get properties() {
        return {
            ...super.properties,
            autounmask: { type: Boolean },
            autocomplete: { type: String },
        };
    }

    #validationPattern = String.raw`\d{2} [A-PR-VYZa-hj-pr-vyzı]{1,3} \d{2,5}`;
    #lazySelectionPattern = String.raw`\d(?:\d(?:[A-PR-VYZa-hj-pr-vyzı]{1,3}(?:\d{1,5})?)?)?`;
    #testRegex = new RegExp(`^${this.#lazySelectionPattern}$`);
    #matchRegex = new RegExp(this.#lazySelectionPattern);
    #groupingRegex = /^(\d{2})([A-PR-VYZa-hj-pr-vyzı]{1,3})(\d{1,5})?$/;

    validateLastChar(e) {
        const value = this.inputElement.value;
        const caret = this.inputElement.selectionStart;
        const caretEnd = this.inputElement.selectionEnd;
        const key = e.key;

        const newValue = (value.slice(0, caret) + key + value.slice(caretEnd)).replaceAll(' ', '');

        return this.#testRegex.test(newValue); // Yeni karakter eklendiğinde değer paternle uyumlu mu?
    }

    mask(value) {
        value = value?.replaceAll(' ', '')?.match(this.#matchRegex); // Geçerli kısmı al
        value = value ? value[0] : '';

        // Formatı uygula
        if (value?.length > 2) {
            value = value.replace(this.#groupingRegex, (_, a, b, c) => [a, b, c].filter(Boolean).join(' '));
        }

        return value?.toLocaleUpperCase('tr-TR'); // Büyük harfe çevir
    }

    unmask(maskedValue) {
        return maskedValue.replaceAll(' ', '');
    }

    validate(maskedValue) {
        if (this.unmaskedValue.length < this.minlength) {
            return this.minLengthValidationMessage;
        }

        return super.validate(maskedValue);
    }

    constructor() {
        super();

        this.autounmask = true;
        this.autocomplete = 'off';

        this.pattern = this.#validationPattern;
        this.maxlength = 10;
        this.minlength = 7;
    }
}

// yapıştırma testleri
// yazma testleri
// silme testleri
// imleç testleri
