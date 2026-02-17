let idCounter = 0;

export function generateId(prefix = 'input') {
    idCounter++;
    const hex = idCounter.toString(16).padStart(3, '0');

    return `${prefix}-${hex}`;
}
