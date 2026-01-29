const allowedElements = new Set();
let isBodyScrollLocked = false;
let originalBodyOverflow = '';
let originalBodyPaddingRight = '';

function preventDefault(e) {
    const path = e.composedPath();
    const targetElement = [...allowedElements].find(el => path.includes(el));

    if (!targetElement) {
        e.preventDefault();
        return;
    }

    const delta = e.deltaY;
    const scrollTop = targetElement.scrollTop;
    const scrollHeight = targetElement.scrollHeight;
    const height = targetElement.clientHeight;

    const noScroll = scrollHeight <= height;
    const cannotScrollUp = delta < 0 && scrollTop <= 0;
    const cannotScrollDown = delta > 0 && scrollTop + height >= scrollHeight - 1;

    if (noScroll || cannotScrollUp || cannotScrollDown) {
        e.preventDefault();
    }
}

/**
 * Prevents all wheel and touchmove events in the page for the given element
 * @param {HTMLElement} element
 * @returns void
 */
export function lockAllScrolls(element) {
    if (!element) return;
    allowedElements.add(element);

    if (allowedElements.size === 1) {
        globalThis.addEventListener('wheel', preventDefault, { passive: false });
        globalThis.addEventListener('touchmove', preventDefault, { passive: false });
    }
}

/**
 * Unlock scroll for the given element
 * @param {HTMLElement} element
 * @returns void
 */
export function unlockAllScrolls(element) {
    if (!element) return;
    allowedElements.delete(element);

    if (allowedElements.size === 0) {
        globalThis.removeEventListener('wheel', preventDefault);
        globalThis.removeEventListener('touchmove', preventDefault);
    }
}

export function hideBodyScroll() {
    if (isBodyScrollLocked) return;

    originalBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const style = globalThis.getComputedStyle(document.body);
    const paddingRight = Number.parseInt(style.paddingRight) || 0;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    originalBodyPaddingRight = document.body.style.paddingRight;
    document.body.style.paddingRight = `${paddingRight + scrollbarWidth}px`;

    isBodyScrollLocked = true;
}

export function showBodyScroll() {
    if (!isBodyScrollLocked) return;

    document.body.style.overflow = originalBodyOverflow || '';
    document.body.style.paddingRight = originalBodyPaddingRight || '';

    isBodyScrollLocked = false;
}
