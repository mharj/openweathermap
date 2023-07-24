/**
 * Ensures that the error is a DOMException or TypeError.
 * @internal
 */
export function fetchErrorWrapper(err: unknown): DOMException | TypeError {
	if (err instanceof DOMException || err instanceof TypeError) {
		return err;
	} else {
		return new TypeError(`Unknown error: ${String(err)}`);
	}
}
