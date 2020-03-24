export interface Bounds<T = string | number>{
    top:T;
    left:T;
    bottom:T;
    right:T;
}

export interface Rect<T = string | number>{
    top:T;
    left:T;
    width:T;
    height:T;
}

export function isRect(o:any): o is Rect{
    return typeof o === 'object' &&  
        'top' in o &&
        'left' in o &&
        'width' in o &&
        'height' in o;
}

export function isBounds(o:any): o is Bounds{
    return typeof o === 'object' &&  
        'top' in o &&
        'left' in o &&
        'bottom' in o &&
        'right' in o;
}