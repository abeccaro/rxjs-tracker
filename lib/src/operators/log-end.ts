import { tap } from 'rxjs';
import { TrackedObservable } from '../tracked-observable/tracked-observable';


export function logEnd<T>(obs: TrackedObservable<T>) {
    return tap({
        next() {
            console.groupEnd();
        },
        error() {},
        complete() {
            if (obs.subscribers === 1)
                console.log(`%c[${obs.name}]: Complete`, 'background: #00BCD4; color: #fff; padding: 3px; font-size: 9px;');
        }
    });
}
