import { tap } from 'rxjs';
import { TrackedObservable } from '../tracked-observable/tracked-observable';
import { Logger } from '../tracked-observable/logger';


export function logStart<T>(obs: TrackedObservable<T>) {
    return tap({
        next(value) {
            Logger.log(obs.name, `%c[${obs.name}: Source]`, 'background: #009688; color: #fff; padding: 3px; font-size: 9px;', value);
        },
        error() {},
        complete() {}
    });
}
