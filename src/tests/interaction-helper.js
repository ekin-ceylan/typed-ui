function fireKeyAndInput(el, char) {
    el.dispatchEvent(new KeyboardEvent('keydown', { key: char, bubbles: true }));
    const before = el.value;
    const start = el.selectionStart ?? before.length;
    const end = el.selectionEnd ?? start;
    el.value = before.slice(0, start) + char + before.slice(end);
    el.selectionStart = el.selectionEnd = start + 1;

    try {
        el.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: char }));
    } catch {
        el.dispatchEvent(new Event('input', { bubbles: true }));
    }
}

async function typeSequence(el, text) {
    for (const ch of text) fireKeyAndInput(el, ch);
}

function backspace(el) {
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? start;

    if (start === end && start > 0) {
        el.value = el.value.slice(0, start - 1) + el.value.slice(end);
        el.selectionStart = el.selectionEnd = start - 1;
    } else {
        el.value = el.value.slice(0, start) + el.value.slice(end);
        el.selectionStart = el.selectionEnd = start;
    }

    el.dispatchEvent(new Event('input', { bubbles: true }));
}

function paste(el, text) {
    el.value = text;
    el.selectionStart = el.selectionEnd = el.value.length;
    el.dispatchEvent(new Event('input', { bubbles: true }));
}

export { fireKeyAndInput, typeSequence, backspace, paste };
