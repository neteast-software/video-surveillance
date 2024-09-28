import { decrypt, encrypt } from '../crypto';

export default {
    set<T>(key: string, value: T) {
        const cipherText = encrypt(value);
        return localStorage.setItem(key, cipherText);
    },
    get<T>(key: string): T | null {
        const cipherText = localStorage.getItem(key);
        if (!cipherText) return null;
        let storageData: T | null = null;
        try {
            storageData = decrypt(cipherText);
        } catch (error) {
            return storageData;
        }
        return storageData;
    },
    remove(key: string) {
        return localStorage.removeItem(key);
    },
    clear() {
        return localStorage.clear();
    }
};
