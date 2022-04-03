import { tap } from 'rxjs';
import { TrackedObservable } from '../tracked-observable/tracked-observable';


export function log<T>(obs: TrackedObservable<T>) {
    return tap({
        next(value) {
            console.log(`%c[${obs.name}: Operator]`, 'background: #009688; color: #fff; padding: 3px; font-size:' +
                ' 9px;', value);
        },
        error(error) {
            console.log(`%[${obs.name}: Error]`, 'background: #E91E63; color: #fff; padding: 3px; font-size: 9px;', error);
        },
        complete() {}
    });
}
