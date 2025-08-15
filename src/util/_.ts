export function throttle(fn: Function, delay: number) {
    let timer: any = null;
    return (...args: any[]) => {
        if (!timer) {
            timer = setTimeout(() => {
                fn?.(args);
                timer = null;
            }, delay);
        }
    }
}


export function debounce(fn: Function, delay: number) {
    let timer: any;
    
    return (...args: any[]) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn?.(...args);
        }, delay);
    };
}