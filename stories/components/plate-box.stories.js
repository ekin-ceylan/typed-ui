import './register.js';

import '../../src/styles/input.css';

export default {
    title: 'Components/PlateBox',
    tags: ['autodocs'],
};

// Mirrors index.html:
// <plate-box field-id="plate-no" label="Plaka Numarası" value="55  ty" required></plate-box>
export const Default = {
    render: () => `
        <plate-box field-id="plate-no" label="Plaka Numarası"></plate-box>
    `,
};

export const RequiredWithValue = {
    render: () => `
        <plate-box field-id="plate-no" label="Plaka Numarası" value="55  ty" required></plate-box>
    `,
};

export const InAForm = {
    render: () => `
        <form>
            <plate-box field-id="plate-no" label="Plaka Numarası" required></plate-box>
            <div style="margin-top: 12px;">
                <button type="submit">Submit</button>
            </div>
        </form>
    `,
};

export const MinLengthExample = {
    render: () => `
        <plate-box field-id="plate-no" label="Plaka Numarası" value="34A" required></plate-box>
    `,
};
