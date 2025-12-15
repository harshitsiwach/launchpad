"use client";

if (typeof window === "undefined") {
    // Polyfill indexedDB for SSR
    if (!(global as any).indexedDB) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    if (!(global as any).localStorage) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (global as any).localStorage = {
            getItem: () => null,
            setItem: () => { },
            removeItem: () => { },
            clear: () => { },
        };
    }
}
