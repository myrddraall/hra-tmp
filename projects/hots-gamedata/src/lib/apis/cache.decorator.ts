

export function Cache(): MethodDecorator {
    return (
        target: object,
        propertyKey: string | symbol,
        descriptor: TypedPropertyDescriptor<any>
    ): TypedPropertyDescriptor<any> | void => {
        // tslint:disable-next-line:variable-name
        const __cache: Map<string, any> = new Map();
        if (descriptor.value) {
            return {
                // tslint:disable:object-literal-shorthand
                // tslint:disable:only-arrow-functions
                value: function(...args: any[]) {
                    const key = JSON.stringify(args);
                    if (!__cache.has(key)) {
                        const ret = descriptor.value.apply(this, args);
                        __cache.set(key, ret);
                    }
                    return __cache.get(key);
                }
            } as TypedPropertyDescriptor<any>;
        } else {
            return {
                // tslint:disable:object-literal-shorthand
                // tslint:disable:only-arrow-functions
                get: function() {
                    const key = '';
                    if (!__cache.has(key)) {
                        const ret = descriptor.get.call(this);
                        __cache.set(key, ret);
                    }
                    return __cache.get(key);
                },
                set: !descriptor.set ? undefined : (function(value: any): void {
                    __cache.delete('');
                    descriptor.set.call(this, value);
                })
            } as TypedPropertyDescriptor<any>;
        }

    };
}
