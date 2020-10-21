export function autobind(_, _2, descriptor) {
    const originalMethod = descriptor.value;
    const adjDesciptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    };
    return adjDesciptor;
}
//# sourceMappingURL=Autobind.js.map