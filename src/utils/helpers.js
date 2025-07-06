import crypto from 'crypto';

/**
 * Generate a random string
 * @param {number} length - Length of the string
 * @returns {string} Random string
 */
export const generateRandomString = (length = 32) => {
    return crypto.randomBytes(length).toString('hex');
};

/**
 * Generate a random UUID
 * @returns {string} UUID
 */
export const generateUUID = () => {
    return crypto.randomUUID();
};

/**
 * Capitalize first letter of a string
 * @param {string} str - Input string
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Format phone number
 * @param {string} phone - Phone number
 * @returns {string} Formatted phone number
 */
export const formatPhone = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }

    return phone;
};

/**
 * Sleep function for async operations
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after specified time
 */
export const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Deep clone an object
 * @param {object} obj - Object to clone
 * @returns {object} Cloned object
 */
export const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

/**
 * Remove sensitive data from object
 * @param {object} obj - Object to sanitize
 * @param {array} fields - Fields to remove
 * @returns {object} Sanitized object
 */
export const sanitizeObject = (
    obj,
    fields = ['password', 'token', 'secret']
) => {
    const sanitized = { ...obj };

    fields.forEach((field) => {
        if (sanitized[field]) {
            delete sanitized[field];
        }
    });

    return sanitized;
};

/**
 * Check if string is valid email
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Paginate results
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {object} Pagination object
 */
export const getPagination = (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    return {
        offset,
        limit: parseInt(limit),
        page: parseInt(page)
    };
};
