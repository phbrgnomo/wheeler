/**
 * Safely set HTML or text content on an element, using DOMPurify if available.
 * If html is provided, uses innerHTML (sanitized if possible), else uses textContent.
 * Optionally adds a fallback class if not using HTML.
 *
 * Usage:
 *   setSafeHTML(el, { html: '<b>markup</b>' }); // will be sanitized if DOMPurify present
 *   setSafeHTML(el, { text: 'plain text' });    // always safe
 *   setSafeHTML(el, { html, text, className }); // fallback to text/class if no DOMPurify
 *
 * @param {HTMLElement} el
 * @param {Object} opts
 * @param {string} [opts.html] - HTML string to set (will be sanitized)
 * @param {string} [opts.text] - Text string to set if HTML not available
 * @param {string} [opts.className] - Class to add if fallback to text
 */
export function setSafeHTML(el, { html, text, className } = {}) {
    const hasDOMPurify = typeof window !== 'undefined' && window.DOMPurify;
    if (hasDOMPurify && html != null) {
        el.innerHTML = window.DOMPurify.sanitize(html);
    } else if (text != null) {
        el.textContent = text;
        if (!hasDOMPurify && className) {
            el.classList.add(className);
        }
    } else if (html != null) {
        // DOMPurify ausente, mas html fornecido: loga warning e usa textContent
        el.textContent = '[DOMPurify missing: displaying as text] ' + html;
        if (className) el.classList.add(className);
        if (typeof window !== 'undefined' && !window.DOMPurifyWarned) {
            window.DOMPurifyWarned = true;
            // eslint-disable-next-line no-console
            console.warn('DOMPurify is not loaded: falling back to textContent for HTML.');
        }
    }
}
/**
 * API Utility Module
 * Provides reusable fetch/AJAX wrappers with consistent error handling
 */

/**
 * Generic fetch wrapper with JSON handling
 * @param {string} url - The API endpoint
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise<any>} - Parsed JSON response
 */
export async function fetchJSON(url, options = {}) {
    try {
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        };
        
        const response = await fetch(url, { ...defaultOptions, ...options });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

/**
 * POST JSON data to an endpoint
 * @param {string} url - The API endpoint
 * @param {object} data - Data to send as JSON
 * @returns {Promise<any>} - Parsed JSON response
 */
export async function postJSON(url, data) {
    return fetchJSON(url, {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

/**
 * PUT JSON data to an endpoint
 * @param {string} url - The API endpoint
 * @param {object} data - Data to send as JSON
 * @returns {Promise<any>} - Parsed JSON response
 */
export async function putJSON(url, data) {
    return fetchJSON(url, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
}

/**
 * DELETE request to an endpoint
 * @param {string} url - The API endpoint
 * @returns {Promise<any>} - Parsed JSON response
 */
export async function deleteJSON(url) {
    return fetchJSON(url, {
        method: 'DELETE'
    });
}

/**
 * GET JSON data from an endpoint
 * @param {string} url - The API endpoint
 * @returns {Promise<any>} - Parsed JSON response
 */
export async function getJSON(url) {
    return fetchJSON(url, {
        method: 'GET'
    });
}

/**
 * Handle response with standard success/error pattern
 * @param {Promise} promise - Fetch promise
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback (optional)
 */
export async function handleResponse(promise, onSuccess, onError) {
    try {
        const data = await promise;
        if (onSuccess) {
            onSuccess(data);
        }
        return data;
    } catch (error) {
        console.error('Error:', error);
        if (onError) {
            onError(error);
        } else {
            alert(`Error: ${error.message}`);
        }
        throw error;
    }
}

/**
 * POST with automatic reload on success
 * @param {string} url - The API endpoint
 * @param {object} data - Data to send
 * @param {string} successMessage - Optional success message
 */
export async function postAndReload(url, data, successMessage) {
    try {
        const response = await postJSON(url, data);
        if (successMessage) {
            console.log(successMessage, response);
        }
        location.reload();
    } catch (error) {
        alert(`Failed: ${error.message}`);
    }
}

/**
 * DELETE with automatic reload on success
 * @param {string} url - The API endpoint
 * @param {string} successMessage - Optional success message
 */
export async function deleteAndReload(url, successMessage) {
    try {
        const response = await deleteJSON(url);
        if (successMessage) {
            console.log(successMessage, response);
        }
        location.reload();
    } catch (error) {
        alert(`Failed to delete: ${error.message}`);
    }
}

/**
 * PUT with automatic reload on success
 * @param {string} url - The API endpoint
 * @param {object} data - Data to send
 * @param {string} successMessage - Optional success message
 */
export async function putAndReload(url, data, successMessage) {
    try {
        const response = await putJSON(url, data);
        if (successMessage) {
            console.log(successMessage, response);
        }
        location.reload();
    } catch (error) {
        alert(`Failed to update: ${error.message}`);
    }
}

/**
 * Set button loading state
 * @param {HTMLElement} button - The button element
 * @param {boolean} isLoading - Whether button is loading
 * @param {string} loadingText - Text to show when loading
 */
export function setButtonLoading(button, isLoading, loadingText = 'Loading...') {
    if (!button) return;
    if (isLoading) {
        // Save the current markup (may include icons/spans) for later restore
        button.dataset.originalText = button.innerHTML;
        button.disabled = true;
        // Only loadingText is user-controlled; spinner markup is fixed, so use DOM APIs
        button.innerHTML = '';
        const icon = document.createElement('i');
        icon.className = 'fas fa-spinner fa-spin';
        button.appendChild(icon);
        const textNode = document.createTextNode(' ' + loadingText);
        button.appendChild(textNode);
    } else {
        button.disabled = false;
        // Restore original markup as-is (do not re-sanitize)
        if (button.dataset.originalText) {
            button.innerHTML = button.dataset.originalText;
        }
        delete button.dataset.originalText;
    }
}
