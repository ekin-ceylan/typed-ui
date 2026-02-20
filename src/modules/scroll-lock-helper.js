const allowedElements = new Set();

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

const lockerElements = new Set();
let originalBodyOverflow = '';
let originalBodyPaddingRight = '';

/**
 * Hides body scroll and adds padding to prevent layout shift when scrollbar disappears
 * @param {HTMLElement} element
 * @returns void
 */
export function hideBodyScroll(element) {
    if (!element) return;
    lockerElements.add(element);
    if (lockerElements.size != 1) return;

    const style = globalThis.getComputedStyle(document.body);
    const paddingInlineEnd = Number.parseInt(style.paddingInlineEnd) || 0;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    originalBodyPaddingRight = document.body.style.paddingInlineEnd;
    originalBodyOverflow = document.body.style.overflow;

    document.body.style.paddingInlineEnd = `${paddingInlineEnd + scrollbarWidth}px`;
    document.body.style.overflow = 'hidden';
}

/**
 * Shows body scroll and removes padding added to prevent layout shift when scrollbar disappears
 * @param {HTMLElement} element
 * @returns void
 */
export function showBodyScroll(element) {
    if (!element) return;
    lockerElements.delete(element);
    if (lockerElements.size > 0) return;

    document.body.style.overflow = originalBodyOverflow || '';
    document.body.style.paddingInlineEnd = originalBodyPaddingRight || '';
}
