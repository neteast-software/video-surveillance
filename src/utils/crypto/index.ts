import CryptoJs from 'crypto-js';
const CryptoSecret = '__Neteast_eBuild__';

/**
 * 加密
 * @param data - 数据
 * @returns 密文
 */
export function encrypt(data: any) {
    const newData = JSON.stringify(data);
    return newData;
    return CryptoJs.AES.encrypt(newData, CryptoSecret).toString();
}

/**
 * 解密
 * @param cipherText - 密文
 * @returns
 */
export function decrypt(cipherText: string) {
    return JSON.parse(cipherText);
    const bytes = CryptoJs.AES.decrypt(cipherText, CryptoSecret);
    const originalText = bytes.toString(CryptoJs.enc.Utf8);
    if (!originalText) return null;
    return JSON.parse(originalText);
}

export function md5(data: any) {
    const newData = JSON.stringify(data);
    return CryptoJs.MD5(newData).toString();
}
