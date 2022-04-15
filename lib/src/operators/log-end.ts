import { tap } from 'rxjs';
import { TrackedObservable } from '../tracked-observable/tracked-observable';
import { SubscriptionTracker } from '../tracked-observable/subscription-tracker';


export function logEnd<T>(obs: TrackedObservable<T>) {
    return tap({
        next() {
            // Logger.closeGroup();
        },
        error() {},
        complete() {
            if (SubscriptionTracker.getCount(obs.name) === 1)
                console.log(`%c[${obs.name}]: Complete`, 'background: #00BCD4; color: #fff; padding: 3px; font-size: 9px;');
        }
    });
}
