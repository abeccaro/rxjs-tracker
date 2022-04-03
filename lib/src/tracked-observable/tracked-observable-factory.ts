import { Observable } from 'rxjs';
import { TrackedObservable } from './tracked-observable';
import { rxjsTrackerConfig } from '../config/rxjs-tracker-config';


export function track<T>(obs: Observable<T>, name?: string): Observable<T> {
    if (!rxjsTrackerConfig.enableTracking)
        return obs;

    const res = new TrackedObservable<T>(obs, name);

    if (obs instanceof TrackedObservable) {
        res.name = name || obs.name || res.name;
        obs.registerSubscription();
    }

    return res;
}
