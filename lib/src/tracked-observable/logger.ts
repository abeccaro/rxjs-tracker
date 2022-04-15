import { SubscriptionTracker } from './subscription-tracker';


export class Logger {
    private static current?: string;

    static log(name: string, ...messages: unknown[]) {
        if (this.current !== name) {
            this.closeGroup();
            this.openGroup(name);
        }

        console.log(...messages);
    }

    static openGroup(name: string) {
        const subscribers = SubscriptionTracker.getCount(name);

        console.group(`${name} - ${subscribers} observer${subscribers === 1 ? '' : 's'}`);
        this.current = name;
    }

    static closeGroup() {
        if (!this.current)
            return;

        console.groupEnd();
        this.current = undefined;
    }
}
