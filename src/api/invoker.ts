import { FlowAction } from "./interfaces";
import { FlowTask } from "./task";

export interface FlowInvoker<T, V> {
    action: FlowAction<T, V>;
    invoke(t: T, subscribers: FlowTask<V>[]): Promise<boolean>;
}

export class FlowAsyncInvoker<T, V> implements FlowInvoker<T, V> {
    action: FlowAction<T, V>;
    constructor(action: FlowAction<T, V>) {
        this.action = action;
    }

    async invoke(t: T, subscribers: FlowTask<V>[]): Promise<boolean> {
        let p = this.action.perform(t).then((result: V) => {
            this.all(subscribers, (item) => {
                item.update(result);
            })
        }).catch((err: Error) => {
            this.all(subscribers, (item) => {
                item.update(null, err);
            })
        })

        await p;
        return true;
    }

    private all(subscribers: FlowTask<V>[], callback: (item: FlowTask<V>, index: number) => void) {
        subscribers.forEach((item: FlowTask<V>, index: number) => {
            callback(item, index);
        })
    }
}