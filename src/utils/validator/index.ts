export function isDef(value: any) {
    return value !== undefined && value !== null;
}

export function isNumber(value: number | string) {
    const reg = /^\d+(\.\d+)?$/;
    return reg.test(value.toString());
}

export function isEmptyStr(str: string) {
    return str !== '' && str.length > 0;
}

export function isObj(x: any) {
    const type = typeof x;
    return x !== null && (type === 'object' || type === 'function');
}

export function isMobile(phoneNumber: number | string) {
    const reg = /^(?:(?:\+|00)86)?1\d{10}$/;
    return reg.test(phoneNumber.toString());
}

export function isImageUrl(url: string) {
    const reg = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg)/i;
    return reg.test(url);
}

export function isVideoUrl(url: string) {
    const reg = /\.(mp4|mpg|mpeg|dat|asf|avi|rm|rmvb|mov|wmv|flv|mkv)/i;
    return reg.test(url);
}

export function isDocUrl(url: string) {
    const reg = /\.(doc|docx|xls|xlsx|ppt|pptx|pdf|txt|xml|html|yml|yaml)/i;
    return reg.test(url);
}

export function isThumbUrl(url: string) {
    const reg = /^http.*thumb\/w\/\d+$/;
    return reg.test(url);
}

export function isUrl(url: string) {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

export function isContent(content: string) {
    const reg = /[\u4e00-\u9fa5\w]+/;
    return reg.test(content);
}

// // 验证是否是密码，6-20位，字母数字
// export function isPassword(password: string) {
//     const reg = /^[a-zA-Z0-9]{6,20}$/;
//     return reg.test(password);
// }
