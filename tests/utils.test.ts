import {
  isObject,
  buildGetLabel,
  buildGetValue,
  valuesEqual,
} from '../src/Select/utils';

describe('isObject', () => {
  it('returns true for plain objects', () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ a: 1 })).toBe(true);
  });

  it('returns false for null', () => {
    expect(isObject(null)).toBe(false);
  });

  it('returns false for primitives', () => {
    expect(isObject(undefined)).toBe(false);
    expect(isObject(42)).toBe(false);
    expect(isObject('str')).toBe(false);
    expect(isObject(true)).toBe(false);
  });
});

describe('buildGetLabel', () => {
  it('uses getLabel when provided', () => {
    const getLabel = jest.fn((item: { name: string }) => item.name);
    const fn = buildGetLabel({ getLabel });
    const item = { name: 'Test' };
    expect(fn(item)).toBe('Test');
    expect(getLabel).toHaveBeenCalledWith(item);
  });

  it('uses labelKey when getLabel not provided', () => {
    const fn = buildGetLabel({ labelKey: 'name' });
    expect(fn({ name: 'Alice' })).toBe('Alice');
    expect(fn({ name: 'Bob', id: 1 } as { name: string })).toBe('Bob');
  });

  it('falls back to "label" key when present and no labelKey', () => {
    const fn = buildGetLabel({});
    expect(fn({ label: 'Option A' })).toBe('Option A');
  });

  it('falls back to "label" when present, else string representation for objects', () => {
    const fn = buildGetLabel({});
    expect(fn({ label: 'Option A' })).toBe('Option A');
    expect(fn({ value: 'v1' })).toBe('[object Object]');
    expect(fn({ other: 1 })).toBe('[object Object]');
  });

  it('returns string for primitives', () => {
    const fn = buildGetLabel({});
    expect(fn('hello')).toBe('hello');
    expect(fn(42)).toBe('42');
  });
});

describe('buildGetValue', () => {
  it('uses getValue when provided', () => {
    const getValue = jest.fn((item: { id: number }) => item.id);
    const fn = buildGetValue({ getValue });
    const item = { id: 5 };
    expect(fn(item)).toBe(5);
    expect(getValue).toHaveBeenCalledWith(item);
  });

  it('uses valueKey when getValue not provided', () => {
    const fn = buildGetValue({ valueKey: 'id' });
    expect(fn({ id: 1, name: 'A' } as { id: number })).toBe(1);
  });

  it('falls back to "value" key when present', () => {
    const fn = buildGetValue({});
    expect(fn({ value: 'x' })).toBe('x');
  });

  it('returns item for primitives', () => {
    const fn = buildGetValue({});
    expect(fn('a')).toBe('a');
    expect(fn(1)).toBe(1);
  });
});

describe('valuesEqual', () => {
  it('returns true for same reference', () => {
    const a = { x: 1 };
    expect(valuesEqual(a, a)).toBe(true);
  });

  it('returns true for same primitives', () => {
    expect(valuesEqual(1, 1)).toBe(true);
    expect(valuesEqual('a', 'a')).toBe(true);
    expect(valuesEqual(null, null)).toBe(true);
  });

  it('returns false for different primitives', () => {
    expect(valuesEqual(1, 2)).toBe(false);
    expect(valuesEqual('a', 'b')).toBe(false);
  });

  it('returns true for objects with same JSON content', () => {
    expect(valuesEqual({ a: 1 }, { a: 1 })).toBe(true);
  });

  it('returns false for objects with different JSON content', () => {
    expect(valuesEqual({ a: 1 }, { a: 2 })).toBe(false);
    expect(valuesEqual({ a: 1 }, { b: 1 })).toBe(false);
  });
});
