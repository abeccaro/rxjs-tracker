import { tap } from 'rxjs';
import { TrackedObservable } from '../tracked-observable/tracked-observable';


export function logStart<T>(obs: TrackedObservable<T>) {
    return tap({
        next(value) {
            console.group(`${obs.name} - ${obs.subscribers} observer${obs.subscribers === 1 ? '' : 's'}`);
            console.log(`%c[${obs.name}: Source]`, 'background: #009688; color: #fff; padding: 3px; font-size: 9px;', value);
        },
        error() {},
        complete() {}
    });
}
