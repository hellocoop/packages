// wrapper for defining fetch

/// <reference lib="dom" />

type _Response = Response;
const _fetch = fetch;

export type { _Response as Response };
export { _fetch as fetch };