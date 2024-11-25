import { FormData, FormConfig } from './type';

export function omitFiledByReadonly(formData: FormData, formConfig?: FormConfig) {
    if (!formConfig) return formData;
    const requiredFileds = formConfig.items
        .filter((item) => item.component !== 'line' && !item.readonly && !item.attrs?.disabled)
        .map((item) => item.name);
    // const omitFileds = formConfig.items.filter((item) => item.readonly).map((item) => item.name);
    const newFormData = Object.keys(formData).reduce((acc, cur) => {
        if (requiredFileds.includes(cur)) {
            acc[cur] = formData[cur];
        }
        return acc;
    }, {} as FormData);
    return newFormData;
}
export function stringifyOptions(options: Record<string, any>[], valueField = 'value') {
    return options.map((item) => {
        return { ...item, [valueField]: String(item[valueField]) };
    });
}
