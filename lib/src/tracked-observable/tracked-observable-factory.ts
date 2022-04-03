import { Observable } from 'rxjs';
import { TrackedObservable } from './tracked-observable';


export function track<T>(obs: Observable<T>, name?: string): TrackedObservable<T> {
    const res = new TrackedObservable<T>(obs, name);

    if (obs instanceof TrackedObservable) {
        res.name = name || obs.name || res.name;
        obs.registerSubscription();
    }

    return res;
}
