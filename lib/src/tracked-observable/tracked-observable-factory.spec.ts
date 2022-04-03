import { map, shareReplay, Subject, take } from 'rxjs';
import { track } from './tracked-observable-factory';


describe('tracked observable factory', () => {

    it('Observers on separate observables from same subject', () => {
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

        const subscription = observable2.subscribe(val => console.debug(val));

        subject.next([5, 10, 15]);
        subject.next([15, 20, 25]);
        subject.next([25, 30, 35]);
        subject.next([35, 40, 45]);

        subscription.unsubscribe();

        expect(console.log).toHaveBeenCalledTimes(41);
    });

    it('Observers on single chain', () => {
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

});
