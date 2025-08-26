import { BaseInput } from './base-input';

export class PlateBox extends BaseInput {
    get minLengthValidationMessage() {
        return `${this.label} alanı en az ${this.minlength - 2} karakterden oluşmalıdır.`;
    }

    get maxLengthValidationMessage() {
        return `${this.label} alanı en fazla ${this.maxlength - 2} karakterden oluşmalıdır.`;
    }

    validateLastChar(e) {
        const el = this.inputElement;
        const value = el.value;
        const caret = el.selectionStart;
        const caretEnd = el.selectionEnd;
        const key = e.key;

        const newValue = (value.slice(0, caret) + key + value.slice(caretEnd)).replace(/\s/g, '');

        // Yeni karakter eklendiğinde değer paternle uyumlu mu?
        return /^\d{0,2}((?<=\d{2})[A-PR-VYZa-hj-pr-vyzı]{1,3}(?<=\D)\d{0,5})?$/.test(newValue);
    }

    mask(value) {
        // Geçerli karakterleri seç
        value = value.replace(/\s/g, '');
        value = value.match(/^\d{1,2}(?:[A-PR-VYZa-hj-pr-vyzı]{1,3}\d{0,5}|[A-PR-VYZa-hj-pr-vyzı]{1,2})?/); // Geçersiz karakterleri kaldır
        value = value ? value[0] : '';

        // Formatı uygula
        if (value?.length > 1) {
            const pattern = /^(\d{0,2}?)([A-PR-VYZa-hj-pr-vyzı]{1,3})(\d{1,5})?$/;
            value = value.replace(pattern, (_, a, b, c) => [a, b, c].filter(Boolean).join(' '));
        }

        return value?.toString().toUpperCase(); // Büyük harfe çevir
    }

    constructor() {
        super();
        this.inputmode = 'text';
        this.placeholder = '34 ABC 123';
        this.pattern = '\\d{2} [A-PR-VYZa-hj-pr-vyzı]{1,3} \\d{2,5}';
        this.maxlength = 10; // Maksimum karakter sayısı
        this.minlength = 9; // Minimum karakter sayısı
    }
}

customElements.define('plate-box', PlateBox);
// yapıştırma testleri
// yazma testleri
// silme testleri
// imleç testleri
