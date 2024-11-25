import { FormItemRule } from "naive-ui";
import { CustomFormItemRule } from "./type";
import { mobile } from "@/utils/validator/pattern";
const patternMap = {
  mobile,
};
const buildInType = [
  "string",
  "number",
  "boolean",
  "method",
  "regexp",
  "integer",
  "float",
  "array",
  "object",
  "enum",
  "date",
  "url",
  "hex",
  "email",
  "pattern",
  "any",
];
const isBuildInType = (type?: string) => {
  if (!type) return false;
  return buildInType.includes(type as any);
};
const isCustomType = (type?: string) => {
  if (!type) return false;
  return Object.keys(patternMap).includes(type);
};
function buildRule(rule: CustomFormItemRule): FormItemRule {
  const type: FormItemRule["type"] = isBuildInType(rule.type)
    ? (rule.type as FormItemRule["type"])
    : "pattern";
  const pattern: FormItemRule["pattern"] = isCustomType(rule.type)
    ? patternMap[rule.type as string]
    : Array.isArray(rule.pattern)
    ? new RegExp(rule.pattern[0], rule.pattern[1])
    : rule.pattern;
  return { ...rule, type, pattern };
}
export function buildRules(
  rules?: CustomFormItemRule | CustomFormItemRule[]
): FormItemRule | Array<FormItemRule> | undefined {
  if (!rules) return;
  if (Array.isArray(rules)) {
    return rules.map((rule) => buildRule(rule));
  }
  return buildRule(rules);
}
