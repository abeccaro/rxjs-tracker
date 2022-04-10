import { tap } from 'rxjs';
import { TrackedObservable } from '../tracked-observable/tracked-observable';
import { SubscriptionTracker } from '../tracked-observable/subscription-tracker';


export function logStart<T>(obs: TrackedObservable<T>) {
    return tap({
        next(value) {
            const subscribers = SubscriptionTracker.getCount(obs.name);

            console.group(`${obs.name} - ${subscribers} observer${subscribers === 1 ? '' : 's'}`);
            console.log(`%c[${obs.name}: Source]`, 'background: #009688; color: #fff; padding: 3px; font-size: 9px;', value);
        },
        error() {},
        complete() {}
    });
}
