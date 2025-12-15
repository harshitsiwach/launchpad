"use client";

if (typeof window === "undefined") {
    // Polyfill indexedDB for SSR
    if (!global.indexedDB) {
        (global as any).indexedDB = {
            open: () => ({
                result: {
                    createObjectStore: () => { },
                    transaction: () => ({ objectStore: () => ({ put: () => { }, get: () => { } }) }),
                },
                addEventListener: () => { },
                removeEventListener: () => { },
                onupgradeneeded: () => { },
                onsuccess: () => { },
                onerror: () => { },
            }),
        };
    }

    // Polyfill localStorage for SSR
    if (!global.localStorage) {
        (global as any).localStorage = {
            getItem: () => null,
            setItem: () => { },
            removeItem: () => { },
            clear: () => { },
        };
    }
}
