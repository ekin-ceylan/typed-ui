import TextBox from './text-box';

export default class PlateBox extends TextBox {
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

        this.placeholder = '34 ABC 123';
        this.autocomplete = 'off';
        this.pattern = this.#validationPattern;
        this.maxlength = 10;
        this.minlength = 7;
        this.autounmask = true;
    }

    willUpdate(changed) {
        super.willUpdate(changed);
        if (changed.has('maxlength')) this.maxlength = 10; // maxlength her zaman 10 olmalı
        if (changed.has('minlength')) this.minlength = 7; // minlength her zaman 7 olmalı
        if (changed.has('pattern')) this.pattern = this.#validationPattern; // pattern her zaman #validationPattern olmalı
    }
}

// yapıştırma testleri
// yazma testleri
// silme testleri
// imleç testleri
