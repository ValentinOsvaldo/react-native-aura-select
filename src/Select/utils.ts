export function isObject(item: unknown): item is Record<string, unknown> {
  return item !== null && typeof item === 'object';
}

export function buildGetLabel<T>(props: {
  getLabel?: (item: T) => string;
  labelKey?: keyof T & string;
}): (item: T) => string {
  if (props.getLabel) return props.getLabel;
  return (item: T) => {
    if (isObject(item)) {
      const key = props.labelKey ?? ('label' in item ? 'label' : undefined);
      if (key && key in item)
        return String((item as Record<string, unknown>)[key]);
      return String(item);
    }
    return String(item);
  };
}

export function buildGetValue<T>(props: {
  getValue?: (item: T) => unknown;
  valueKey?: keyof T & string;
}): (item: T) => unknown {
  if (props.getValue) return props.getValue;
  return (item: T) => {
    if (isObject(item)) {
      const key = props.valueKey ?? ('value' in item ? 'value' : undefined);
      if (key && key in item) return (item as Record<string, unknown>)[key];
      return item;
    }
    return item;
  };
}

export function valuesEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (
    a != null &&
    b != null &&
    typeof a === 'object' &&
    typeof b === 'object'
  ) {
    return JSON.stringify(a) === JSON.stringify(b);
  }
  return false;
}
