/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Observable, Observer, OperatorFunction, Subscription } from 'rxjs';
import { log } from '../operators/log';
import { logEnd } from '../operators/log-end';
import { logStart } from '../operators/log-start';


export class TrackedObservable<T> extends Observable<T> {

    name: string;

    subscribers = 0;

    trackedSource?: TrackedObservable<T>;

    constructor(obs: Observable<T>, name = 'Unknown') {
        // @ts-ignore
        const subscribe = obs._subscribe as (this: Observable<T>, subscriber: Subscriber<T>) => TeardownLogic;
        super(subscribe);

        this.source = obs instanceof TrackedObservable ? obs.source : obs;
        this.name = name;
    }

    // region Pipe function declarations

    override pipe(): TrackedObservable<T>;
    override pipe<A>(op1: OperatorFunction<T, A>): TrackedObservable<A>;
    override pipe<A, B>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>): TrackedObservable<B>;
    override pipe<A, B, C>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>): TrackedObservable<C>;
    override pipe<A, B, C, D>(
        op1: OperatorFunction<T, A>,
        op2: OperatorFunction<A, B>,
        op3: OperatorFunction<B, C>,
        op4: OperatorFunction<C, D>
    ): TrackedObservable<D>;
    override pipe<A, B, C, D, E>(
        op1: OperatorFunction<T, A>,
        op2: OperatorFunction<A, B>,
        op3: OperatorFunction<B, C>,
        op4: OperatorFunction<C, D>,
        op5: OperatorFunction<D, E>
    ): TrackedObservable<E>;
    override pipe<A, B, C, D, E, F>(
        op1: OperatorFunction<T, A>,
        op2: OperatorFunction<A, B>,
        op3: OperatorFunction<B, C>,
        op4: OperatorFunction<C, D>,
        op5: OperatorFunction<D, E>,
        op6: OperatorFunction<E, F>
    ): TrackedObservable<F>;
    // noinspection OverlyComplexFunctionJS
    override pipe<A, B, C, D, E, F, G>(
        op1: OperatorFunction<T, A>,
        op2: OperatorFunction<A, B>,
        op3: OperatorFunction<B, C>,
        op4: OperatorFunction<C, D>,
        op5: OperatorFunction<D, E>,
        op6: OperatorFunction<E, F>,
        op7: OperatorFunction<F, G>
    ): TrackedObservable<G>;
    // noinspection OverlyComplexFunctionJS
    override pipe<A, B, C, D, E, F, G, H>(
        op1: OperatorFunction<T, A>,
        op2: OperatorFunction<A, B>,
        op3: OperatorFunction<B, C>,
        op4: OperatorFunction<C, D>,
        op5: OperatorFunction<D, E>,
        op6: OperatorFunction<E, F>,
        op7: OperatorFunction<F, G>,
        op8: OperatorFunction<G, H>
    ): TrackedObservable<H>;
    // noinspection OverlyComplexFunctionJS
    override pipe<A, B, C, D, E, F, G, H, I>(
        op1: OperatorFunction<T, A>,
        op2: OperatorFunction<A, B>,
        op3: OperatorFunction<B, C>,
        op4: OperatorFunction<C, D>,
        op5: OperatorFunction<D, E>,
        op6: OperatorFunction<E, F>,
        op7: OperatorFunction<F, G>,
        op8: OperatorFunction<G, H>,
        op9: OperatorFunction<H, I>
    ): TrackedObservable<I>;
    // noinspection OverlyComplexFunctionJS
    override pipe<A, B, C, D, E, F, G, H, I>(
        op1: OperatorFunction<T, A>,
        op2: OperatorFunction<A, B>,
        op3: OperatorFunction<B, C>,
        op4: OperatorFunction<C, D>,
        op5: OperatorFunction<D, E>,
        op6: OperatorFunction<E, F>,
        op7: OperatorFunction<F, G>,
        op8: OperatorFunction<G, H>,
        op9: OperatorFunction<H, I>,
        ...operations: OperatorFunction<never, never>[]
    ): TrackedObservable<unknown>;

    // endregion

    override pipe(...operations: OperatorFunction<never, never>[]): TrackedObservable<unknown> {
        const newOperators: unknown[] = [logStart(this)];
        for (const op of operations) {
            newOperators.push(op);
            newOperators.push(log(this));
        }
        newOperators.push(logEnd(this));

        // @ts-ignore
        const piped = super.pipe.apply(this, newOperators);
        const res = new TrackedObservable(piped, this.name);

        if (piped instanceof TrackedObservable)
            piped.registerSubscription();
        res.subscribers = this.subscribers;
        res.trackedSource = this;

        this.subscribe = super.subscribe;

        return res;
    }

    // region Subscribe function declarations

    override subscribe(observer?: Partial<Observer<T>>): Subscription;
    override subscribe(next: (value: T) => void): Subscription;
    /** @deprecated Instead of passing separate callback arguments, use an observer argument. Signatures taking separate callback arguments will be removed in v8. Details: https://rxjs.dev/deprecations/subscribe-arguments */
    override subscribe(next?: ((value: T) => void) | null, error?: ((error: unknown) => void) | null, complete?: (() => void) | null): Subscription;

    // endregion

    override subscribe(
        observerOrNext?: Partial<Observer<T>> | ((value: T) => void) | null,
        error?: ((error: unknown) => void) | null,
        complete?: (() => void) | null
    ): Subscription {
        this.registerSubscription();

        // @ts-ignore
        const sub = super.subscribe(observerOrNext, error, complete);
        sub.add(() => this.unregisterSubscription());

        return sub;
    }

    registerSubscription() {
        if (this.trackedSource && this.trackedSource.name === this.name)
            this.trackedSource.subscribers++;

        // TODO: idea for tracking the code location of subscribers (Angular only)
        // // @ts-ignore
        // Error.stackTraceLimit = Infinity;
        // const matches = new Error().stack.split('\n').filter(row => row.includes('ng://') || row.includes('main.js'));
        // console.error(matches.length ? matches[0] : 'Unknown source');

        this.subscribers++;
        console.log(`${this.name} got a subscription: ${this.subscribers - 1} -> ${this.subscribers}`);
    }

    unregisterSubscription() {
        this.subscribers--;
        if (this.trackedSource && this.trackedSource.name === this.name)
            this.trackedSource.subscribers--;
        console.log(`${this.name} lost a subscription: ${this.subscribers + 1} -> ${this.subscribers}`);
    }

}
