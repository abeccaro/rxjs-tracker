export class SubscriptionTracker {
    private static subscriptions: Record<string, number> = {};

    static getCount(name: string): number {
        return this.subscriptions[name] || 0;
    }

    static registerSubscription(name: string) {
        if (!Object.keys(this.subscriptions).includes(name))
            this.subscriptions[name] = 0;
        this.subscriptions[name]++;
        console.log(`${name} got a subscription: ${this.subscriptions[name] - 1} -> ${this.subscriptions[name]}`);
        return this.getCount(name);
    }

    static unregisterSubscription(name: string) {
        if (!Object.keys(this.subscriptions).includes(name)) {
            console.warn('Unregistering from untracked observable: ' + name);
            return 0;
            // this.subscriptions[name] = 0;
        }

        this.subscriptions[name]--;
        console.log(`${name} lost a subscription: ${this.subscriptions[name] + 1} -> ${this.subscriptions[name]}`);
        return this.getCount(name);
    }

    static reset() {
        this.subscriptions = {};
    }
}
