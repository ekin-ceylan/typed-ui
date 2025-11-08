import TextBox from './text-box';

export default class PlateBox extends TextBox {
    #validationPattern = `\\d{2} [A-PR-VYZa-hj-pr-vyzı]{1,3} \\d{2,5}`;
    #lazySelectionPattern = `\\d(?:\\d(?:[A-PR-VYZa-hj-pr-vyzı]{1,3}(?:\\d{1,5})?)?)?`;
    #testRegex = new RegExp(`^${this.#lazySelectionPattern}$`);
    #matchRegex = new RegExp(this.#lazySelectionPattern);
    #groupingRegex = /^(\d{2})([A-PR-VYZa-hj-pr-vyzı]{1,3})(\d{1,5})?$/;

    get minLengthValidationMessage() {
        return `${this.label} alanı en az ${this.minlength - 2} karakterden oluşmalıdır.`;
    }

    get maxLengthValidationMessage() {
        return `${this.label} alanı en fazla ${this.maxlength - 2} karakterden oluşmalıdır.`;
    }

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

        return value?.toString().toUpperCase('tr-TR'); // Büyük harfe çevir
    }

    unmask(maskedValue) {
        return maskedValue.replaceAll(' ', '');
    }

    constructor() {
        super();
        this.inputmode = 'text';
        this.placeholder = '34 ABC 123';
        this.pattern = this.#validationPattern;
        this.maxlength = 10;
        this.minlength = 9;
    }
}

customElements.define('plate-box', PlateBox);
// yapıştırma testleri
// yazma testleri
// silme testleri
// imleç testleri
