import { LitElement, TemplateResult, CSSResultGroup } from 'lit';

export declare abstract class InputBase extends LitElement {
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

    abstract override onFormSubmit(event: SubmitEvent | Event): void;

    protected override createRenderRoot(): Element | ShadowRoot;
    connectedCallback(): void;
    constructor();
}

export declare class ModalDialog extends LitElement {
    open: boolean;
    slots?: NodeListOf<Element>;
    backdropClose?: boolean;
    escClose?: boolean;

    show(): void;
    hide(): void;

    override connectedCallback(): void;
    protected override firstUpdated(): void;
    protected override updated(): void;
    protected override createRenderRoot(): Element | ShadowRoot;
    protected override render(): unknown;

    constructor();
}

export declare class TextBox extends InputBase {
    type?: string;
    inputmode?: string;
    pattern?: string;
    maxlength?: number;
    minlength?: number;
    max?: number;
    min?: number;
    autounmask?: boolean;
    autocomplete?: string;

    regexPattern: RegExp | null;
    globalRegexPattern: RegExp | null;
    unmaskedValue?: string;

    get minLengthValidationMessage(): string;
    get maxLengthValidationMessage(): string;
    get maxValueValidationMessage(): string;
    get minValueValidationMessage(): string;
    get patternValidationMessage(): string;

    constructor();

    protected override firstUpdated(): void;
    protected override attributeChangedCallback(name: string, oldValue: any, newValue: any): void;

    // Public API
    mask(value: string): string;
    unmask(maskedValue: string): string;
    validate(value: string, unmaskedValue?: string): string;
    validateLastChar(event: KeyboardEvent): boolean;

    // Event handlers
    onInput(e: InputEvent & { target: HTMLInputElement }): void;
    onChange(e: Event & { target: HTMLInputElement }): void;
    onKeydown(e: KeyboardEvent & { target: HTMLInputElement }): void;
    onBlur(e: Event): void;
    onInvalid(e: Event): void;
    override onFormSubmit(e: SubmitEvent): void;

    // Render
    protected override render(): import('lit').TemplateResult;
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
