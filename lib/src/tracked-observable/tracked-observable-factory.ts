import { Observable } from 'rxjs';
import { TrackedObservable } from './tracked-observable';
import { RxjsTrackerConfig } from '../config/rxjs-tracker-config';
import { SubscriptionTracker } from './subscription-tracker';


export function track<T>(obs: Observable<T>, name?: string): Observable<T> {
    if (!RxjsTrackerConfig.enableTracking)
        return obs;

    const res = new TrackedObservable<T>(obs, name);

    if (obs instanceof TrackedObservable) {
        res.name = name || obs.name || res.name;
        if (obs.name !== res.name)
            SubscriptionTracker.registerSubscription(obs.name);
    }

    return res;
}
