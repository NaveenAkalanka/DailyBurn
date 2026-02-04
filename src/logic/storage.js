import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

// Helper to determine if we are native
const isNative = Capacitor.isNativePlatform();

export const storage = {
    /**
     * Get a value from storage
     * @param {string} key 
     * @returns {Promise<any | null>} Parsed object or null
     */
    get: async (key) => {
        if (isNative) {
            const { value } = await Preferences.get({ key });
            try {
                return value ? JSON.parse(value) : null;
            } catch (e) {
                console.warn('Storage parse error', e);
                return null;
            }
        } else {
            // Web: localStorage
            const value = localStorage.getItem(key);
            try {
                return value ? JSON.parse(value) : null;
            } catch (e) {
                return null;
            }
        }
    },

    /**
     * Set a value in storage
     * @param {string} key 
     * @param {any} value - Will be JSON stringified
     */
    set: async (key, value) => {
        const stringValue = JSON.stringify(value);
        if (isNative) {
            await Preferences.set({ key, value: stringValue });
        } else {
            localStorage.setItem(key, stringValue);
        }
    },

    /**
     * Remove a value
     * @param {string} key 
     */
    remove: async (key) => {
        if (isNative) {
            await Preferences.remove({ key });
        } else {
            localStorage.removeItem(key);
        }
    },

    /**
     * Clear all keys (Use with caution)
     */
    clear: async () => {
        if (isNative) {
            await Preferences.clear();
        } else {
            localStorage.clear();
        }
    }
};
