import { LitElement, TemplateResult, CSSResultGroup } from 'lit';

// TextBox component
export class TextBox extends LitElement {
    value: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    minlength?: number;
    maxlength?: number;
    disabled?: boolean;
    readonly?: boolean;
    error?: string;
    autofocus?: boolean;
    inputElement: HTMLInputElement | null;
    validationMessage?: string;
    focus(): void;
    blur(): void;
    select(): void;
    // ...diğer props ve metodlar...
}

// PlateBox component (TextBox'tan türemiş)
export class PlateBox extends TextBox {
    minLengthValidationMessage: string;
    maxLengthValidationMessage: string;
    mask(value: string): string;
    validateLastChar(e: KeyboardEvent): void;
    // ...diğer props ve metodlar...
}

// SelectBox component
export class SelectBox extends LitElement {
    value: string;
    label: string;
    options: Array<{ label: string; value: string }>;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    autofocus?: boolean;
    placeholder?: string;
    selectElement: HTMLSelectElement | null;
    focus(): void;
    blur(): void;
    // ...diğer props ve metodlar...
}

export class InputBase extends LitElement {
    inputElement: HTMLInputElement | null;

    fieldId?: string;
    fieldName?: string;
    value?: string;
    label?: string;
    hideLabel?: boolean;
    placeholder?: string;
    required?: boolean;
    ariaInvalid?: boolean;
    validationMessage?: string;

    get inputLabel(): string | null;
    get labelId(): string | null;
    get errorId(): string | null;
    get requiredValidationMessage(): string;

    abstract onFormSubmit(event: SubmitEvent | Event): void;

    createRenderRoot(): Element | ShadowRoot;
    connectedCallback(): void;
    constructor();
}

// SlotCollectorMixin
export function SlotCollectorMixin<T extends new (...args: any[]) => {}>(
    base: T
): T & {
    slottedChildren: Element[];
    connectedCallback(): void;
    disconnectedCallback(): void;
    // ...diğer mixin metodları...
};
