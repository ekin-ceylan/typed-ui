export function injectStyles(styleId, styleText) {
    if (!styleId || !styleText || document.getElementById(styleId)) {
        return;
    }

    const clean = cleanupStyles(styleText);
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = clean;
    document.head.appendChild(style);
}

export function cleanupStyles(styleText) {
    return styleText
        .replaceAll(/(^\s+)|\n|(\s+$)/gm, '') // Remove newlines and leading/trailing spaces
        .replaceAll(/\s*;?\s*}\s*/g, '}') // Remove any unnecessary spaces around '}' and the last ';'
        .replaceAll(/\s*{\s*/g, '{') // Remove unnecessary spaces around '{'
        .replaceAll(/\s*:\s*/g, ':') // Remove unnecessary spaces around ':'
        .trim();
}
