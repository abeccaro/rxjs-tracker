import { map, shareReplay, Subject, take } from 'rxjs';
import { track } from './tracked-observable-factory';
import { TrackedObservable } from './tracked-observable';
import { RxjsTrackerConfig } from '../config/rxjs-tracker-config';
import { SubscriptionTracker } from './subscription-tracker';


describe('tracked observable factory', () => {

    it('Observers on separate observables from same subject', () => {
        SubscriptionTracker.reset();
        spyOn(console, 'log').and.callThrough();

        const subject = new Subject<number[]>();
        const sub = track(subject.asObservable(), 'Subject')
            .pipe(shareReplay(1));

        const observable = track(sub, 'Observable').pipe(
            map(x => [...x, ...x]),
            take(2)
        );

        observable.subscribe(val => console.debug(val));
        observable.subscribe(val => console.debug(val));

        const observable2 = track(sub, 'Observable 2').pipe(
            map(x => x)
        );

        observable2.pipe(take(1)).subscribe(val => console.debug(val));
        observable2.pipe(take(2)).subscribe(val => console.debug(val));
        const subscription = observable2.subscribe(val => console.debug(val));

        subject.next([5, 10, 15]);
        subject.next([15, 20, 25]);
        subject.next([25, 30, 35]);
        subject.next([35, 40, 45]);

        subscription.unsubscribe();

        expect(console.log).toHaveBeenCalledTimes(60);
    });

    it('Observers on single chain', () => {
        SubscriptionTracker.reset();
        spyOn(console, 'log').and.callThrough();

        const subject = new Subject<number[]>();
        const sub = track(subject.asObservable(), 'Subject')
            .pipe(shareReplay(1));

        const observable = track(sub, 'Observable').pipe(
            map(x => [...x, ...x]),
            shareReplay(1)
        );

        const subscription = observable.subscribe(val => console.debug(val));

        const observable2 = track(observable, 'Observable 2').pipe(
            map(x => x),
            take(3)
        );

        observable2.subscribe(val => console.debug(val));

        subject.next([5, 10, 15]);
        subject.next([15, 20, 25]);
        subject.next([25, 30, 35]);
        subject.next([35, 40, 45]);

        subscription.unsubscribe();

        expect(console.log).toHaveBeenCalledTimes(39);
    });

    it('Disabling tracking should behave like normal rxjs with no logs', () => {
        spyOn(console, 'log').and.callThrough();

        RxjsTrackerConfig.enableTracking = false;

        const subject = new Subject<string>();
        const sub = track(subject.asObservable(), 'Subject');
        sub.subscribe(val => console.debug(val));
        subject.next('test');

        RxjsTrackerConfig.enableTracking = true;

        expect(console.log).not.toHaveBeenCalled();
        expect(sub instanceof TrackedObservable).toBeFalse();
    });

});
