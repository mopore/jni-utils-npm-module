import { AssertionError } from "assert";

export class Assert {

    static isDefined<T>(val: T): asserts val is NonNullable<T> {
        if (val === undefined || val === null) {
            throw new AssertionError(
                {
                    message: `Expected 'val' to be defined, but received ${val}`,
                    expected: 'A value which is not "null", "undefined" nor "never"'
                }
            );
        }
    }

    static isFilledArray<T>(val: T[]): T[] {
        if ( val.length < 1 ) {
            throw new AssertionError(
                {
                    message: `Expected array not to be empty, but "length < 0"`,
                    expected: 'An array with at least one entry.'
                }
            );
        }
        return val;
    }

}