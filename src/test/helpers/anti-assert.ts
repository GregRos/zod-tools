export interface AssertT<T> {
    is<S>(what: T extends S ? true : false): this;
    si<S>(what: S extends T ? true : false): this;
}

export interface AssertNever {
    is<S>(what: never extends S ? true : false): this;
    si<S>(what: S extends never ? true : false): this;
}

export function expectT(value: never): AssertNever;
export function expectT<T>(
    value: T
): T extends never ? AssertNever : AssertT<T>;
export function expectT<T>(
    value: T
): T extends never ? AssertNever : AssertT<T> {
    return {
        is<S>(what: T extends S ? true : false) {
            return this;
        }
    } as any;
}
