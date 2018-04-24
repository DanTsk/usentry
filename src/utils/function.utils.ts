export const AsyncFunction = (async function () {}).constructor;

export const isFunction = (target: any, propertyKey: string) => (propertyKey && typeof target[propertyKey] == "function" && propertyKey != 'constructor');
