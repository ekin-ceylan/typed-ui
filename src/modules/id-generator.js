let idCounter = 0;

/**
 * Generates a unique ID string by incrementing an internal counter and converting it to a hexadecimal string. The resulting ID is padded with leading zeros to ensure it is at least 4 characters long.
 * @returns {string} A unique ID string in hexadecimal format, padded to at least 4 characters.
 */
export default function generateId() {
    idCounter++;
    return idCounter.toString(16).padStart(4, '0');
}
