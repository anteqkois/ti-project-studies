export const tryParseJson = <T = unknown>(value: any): T => {
  try {
    return JSON.parse(value as string);
  } catch (e) {
    console.error('tryParseJson', value);
    throw e;
  }
};

export function isString(str: unknown): str is string {
  return str != null && typeof str === 'string';
}

export function isEmpty<T>(value: T | null | undefined): boolean {
  if (value == null) {
    return true;
  }

  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }

  return false;
}

export const isNil = <T>(
  value: T | null | undefined
): value is null | undefined => {
  return value === null || value === undefined;
};

export const isInteger = (value: unknown) => {
  return typeof value == 'number' && value == toInteger(value);
};

export const toInteger = (value: unknown) => {
  const result = toFinite(value),
    remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
};

export const toFinite = (value: unknown): number => {
  if (!value) return 0;
  return Number(value);
};
