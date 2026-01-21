import TextBox from './text-box';

/** @extends TextBox */
export default class IntegerBox extends TextBox {
    constructor() {
        super();
        this.type = 'text';
        this.inputmode = 'numeric';
        this.pattern = '\\d*';
    }

    mask(value) {
        return value.replace(/\D/g, ''); // Sadece rakamları kabul et
    }

    /** @override */
    unmask(maskedValue) {
        const value = maskedValue?.replace(/\D/g, '');

        return value ? Number(value).toFixed(2) : null;
    }

    // validate(element) {
    //     const value = element.value;

    //     if (this.required && (!value || value.trim() === '')) {
    //         return 'Bu alan zorunludur.';
    //     }

    //     if (value && !/^\d+$/.test(value)) {
    //         return 'Sadece pozitif tam sayı girebilirsiniz.';
    //     }

    //     if (value && parseInt(value, 10) < 0) {
    //         return 'Negatif sayı giremezsiniz.';
    //     }

    //     return element.validationMessage || '';
    // }

    // onPaste(e) {
    //     e.preventDefault();
    //     const paste = (e.clipboardData || window.clipboardData).getData('text');
    //     const numericValue = paste.replace(/\D/g, '');
    //     if (numericValue) {
    //         e.target.value = numericValue;
    //         this.onInput(e);
    //     }
    // }
}

// customElements.define('integer-box', IntegerBox);
