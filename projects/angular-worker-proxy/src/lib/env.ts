declare const window: unknown;
declare const importScripts: unknown;

export const ENVIRONMENT_IS_WEB = typeof window === 'object';
export const ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
