import { BaseInput } from './base-input';

export class PlateBox extends BaseInput {
    #lastKey = null;

    get minLengthValidationMessage() {
        return `${this.label} alanı en az 7 karakterden oluşmalıdır.`;
    }

    onKeydown(e) {
        const el = this.inputElement;
        const value = el.value;
        const caret = el.selectionStart;
        const key = e.key;
        this.#lastKey = key;

        if (caret === value.length || key.length > 1) {
            return;
        }

        const newValue = (value.slice(0, caret) + key + value.slice(caret)).replace(/\s/g, '');

        if (!/^\d{2}[A-PR-VYZa-hj-pr-vyzı]{1,3}\d{2,5}/.test(newValue)) {
            e.preventDefault();
        }
    }

    onInput(e) {
        const el = e.target;
        const value = el.value;
        const caret = el.selectionStart;

        const formatted = this.#formatPlateNumber(value);
        e.target.value = formatted;

        if (caret !== value.length) {
            const isDel = this.#lastKey === 'Delete';
            const caretPosition = isDel ? caret - value.length + formatted.length : this.#formatPlateNumber(value.slice(0, caret)).length;
            el.setSelectionRange(caretPosition, caretPosition); // İmleci eski konumuna getir
        }

        super.onInput(e);
    }

    #formatPlateNumber(value) {
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
        this.type = 'text';
        this.inputmode = 'text';
        this.placeholder = '34 AAA 12345';
        this.pattern = '\\d{2} [A-PR-VYZa-hj-pr-vyzı]{1,3} \\d{2,5}';
        this.maxlength = 10; // Maksimum karakter sayısı
        this.minlength = 9; // Minimum karakter sayısı
    }
}

customElements.define('plate-box', PlateBox);
