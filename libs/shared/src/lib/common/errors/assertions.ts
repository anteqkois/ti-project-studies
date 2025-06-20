import { CustomError } from './error';
import { ErrorCode } from './errorCodes';

export function assertEqual<T>(
  actual: T,
  expected: T,
  fieldName1: string,
  fieldName2: string
): asserts actual is T {
  if (actual !== expected) {
    throw new Error(`${fieldName1} and ${fieldName2} should be equal`);
  }
}

export function assertNotNullOrUndefined<T>(
  value: T | null | undefined,
  fieldName: string,
  metadata?: CustomError['metadata']
): asserts value is T {
  if (value === null || value === undefined) {
    throw new CustomError(
      `${fieldName} is null or undefined`,
      ErrorCode.ENTITY_NOT_FOUND,
      metadata
    );
  }
}

export function assertNotEmpty<T>(
  value: T | null | undefined,
  fieldName?: string,
  metadata?: CustomError['metadata']
): asserts value is T {
  if (
    value === null ||
    value === undefined ||
    (typeof value === 'string' && value.trim() === '') ||
    (Array.isArray(value) && value.length === 0)
  ) {
    const inferredName = fieldName ?? 'Value';
    throw new CustomError(
      `${inferredName} is empty, null, or undefined`,
      ErrorCode.ENTITY_NOT_FOUND,
      metadata
    );
  }
}

export function assertNotEqual<T>(
  value1: T,
  value2: T,
  fieldName1: string,
  fieldName2: string
): void {
  if (value1 === value2) {
    throw new Error(`${fieldName1} and ${fieldName2} should not be equal`);
  }
}

export const isNotUndefined = <T>(value: T | undefined): value is T => {
  return value !== undefined;
};
