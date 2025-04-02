export function tryCatch(fn: () => Promise<any>) {
    try {
        return fn();
    } catch (e) {
        console.log(e);
        return null;
    }
}
