
const RETURN_CACHE_PROPERTY_KEY = '__returnChahe__functionCaches';

function getInstanceCaches(instance: any): Map<string, any> {
    if (!Reflect.has(instance, RETURN_CACHE_PROPERTY_KEY)) {
        return instance[RETURN_CACHE_PROPERTY_KEY];
    }
}

function initCache(fn: Function) {
    if (!Reflect.has(fn, RETURN_CACHE_PROPERTY_KEY)){
        Reflect.defineProperty(fn, RETURN_CACHE_PROPERTY_KEY, {
            value: new Map(),
            enumerable: false
        });
    }
}

function getFnCache(fn: Function):Map<any, Map<string, any>> {
    return fn[RETURN_CACHE_PROPERTY_KEY];
}

function getInstCache(fn: Function, inst:any) {
    const map = getFnCache(fn);
    if(!map.has(inst)){
        map.set(inst, new Map());
    }
    return map.get(inst);
}

function getCache(fn: Function, inst:any, args:string = '') {
    const map = getInstCache(fn, inst);
    return map.get(args);
}

function setCache(fn: Function, inst:any, returnValue: any, args:string = '') {
    const map = getInstCache(fn, inst);
    return map.set(args, returnValue);
}

function hasCache(fn: Function, inst:any, args:string = ''):boolean {
    const map = getInstCache(fn, inst);
    return map.has(args);
}
function deleteCache(fn: Function, inst:any, args:string = ''):boolean {
    const map = getInstCache(fn, inst);
    return map.delete(args);
}


export function Cache(): MethodDecorator {
    return (
        target: object,
        propertyKey: string | symbol,
        descriptor: TypedPropertyDescriptor<any>
    ): TypedPropertyDescriptor<any> | void => {
        if (descriptor.value) {
            const proxy = function(...args: any[]):any{
                const key = JSON.stringify(args);
                if(hasCache(proxy, this, key)){
                    return getCache(proxy, this, key);
                }
                const ret = descriptor.value.apply(this, args);
                setCache(proxy, this, ret, key);
                return ret;
            };
            initCache(proxy);
            return {
                value: proxy
            } as TypedPropertyDescriptor<any>;
        } else {
            const getFn = function():any{
                if(hasCache(getFn, this)){
                    return getCache(getFn, this);
                }
                const ret = descriptor.get.call(this);
                setCache(getFn, this, ret);
                return ret;
            }
            initCache(getFn);
            let setFn;
            if(descriptor.set){
                setFn = function(value:any):void{
                    deleteCache(getFn, this);
                    descriptor.set.call(this, value);
                }
            }
            return {
                get: getFn,
                set: setFn
            } as TypedPropertyDescriptor<any>;
        }

    };
}
