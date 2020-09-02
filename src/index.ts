import { FlowAction, IFlowDict, IFlowEventCallback, FlowEventType } from "./api/interfaces";
import { FlowInvoker, FlowAsyncInvoker } from "./api/invoker";
import { FlowTask } from "./api/task";

export const BPD_Flow_ver = "0.1.0";

const COUNTER = counter();

export { FlowAction } from "./api/interfaces";

export function* counter() {
    let idx = 0;
    while (true) {
        let reset = yield idx++;
        if (reset || idx > 200000) {
            idx = 0
        }
    }
}

export class Flow<T, V> {
    actions: FlowManagers<T, V>;
    constructor(...actions: FlowAction<T, V>[]) {
        this.actions = {};
        actions.forEach(act => {
            this.actions[act.name] = new FlowActionManager(act);
        })
    }

    subscribe(name: string, task?: FlowTask<V>): FlowTask<V> {
        let action = this.actions[name];
        if (action) {
            return action.subscribe(task);
        }
        return null;
    }

    unsubscribe(name: string, id: string) {
        let action = this.actions[name];
        if (action) {
            action.unsubscribe(id);
        }
    }

    perform(actionName: string, args: T) {
        let action = this.actions[actionName];
        if (action) {
            action.perform(args);
        }
    }
}

export interface FlowManagers<T, V> {
    [id: string]: FlowActionManager<T, V>;
}


export class FlowActionManager<T, V> {
    #subscribers: FlowTask<V>[];
    #action: FlowAction<T, V>;
    #isLocked: boolean;
    #invoker: FlowInvoker<T, V>;
    #queue: IFlowDict<T>;
    constructor(action: FlowAction<T, V>) {
        this.#subscribers = [];
        this.#action = action;
        this.#invoker = new FlowAsyncInvoker(action);
        this.#queue = new FlowDict<T>();
    }

    subscribe(task?: FlowTask<V>): FlowTask<V> {
        let flowTask = null;
        if (!task) {
            flowTask = new FlowTask<V>(COUNTER.next + "");
        } else if (this.findTaskIndex(task.id) > -1) {
            return task;
        } else {
            flowTask = task;
        }
        this.#subscribers.push(flowTask);
        return flowTask;
    }

    unsubscribe(id: string) {
        let idx = this.findTaskIndex(id)
        if (idx > -1) {
            this.#subscribers.splice(idx, 1);
        }
    }

    perform(t: T, key?: string): void {
        let queueKey = key ?? this.getKey(t);
        this.#queue.add(queueKey, t);
        this.call();
    }

    getStats(): any {
        return {
            queueCount: this.#queue.count(),
            subscribersCount: this.#subscribers.length
        }
    }

    private findTaskIndex(id: string): number {
        return this.#subscribers.findIndex(it => it.id === id);
    }

    private call() {
        if (!this.#isLocked) {
            this.#isLocked = true;
            let param = this.#queue.first();
            this.#invoker.invoke(param, this.#subscribers).then((resul) => {
                this.#isLocked = false;
                this.#queue.removeIndex(0);
                if (this.#queue.count() > 0) {
                    this.call();
                }
            });
        }
    }

    private getKey(t: T): string {
        if (typeof t === "string") {
            return t;
        }
        if (typeof t === "boolean" || typeof t === "number") {
            return t + "";
        }
        else if (Array.isArray(t)) {
            return `[${t.length === 0 ? 0 : t.length}]`;
        }
        return JSON.stringify(t);
    }
}



export class FlowDict<T> implements IFlowDict<T> {
    keys: string[];
    values: T[];
    #onEvent: IFlowEventCallback;
    constructor(onEvent?: IFlowEventCallback) {
        this.keys = [];
        this.values = [];
        this.#onEvent = onEvent;
    }
    add(key: string, value: T): void {
        if (!this.has(key)) {
            this.keys.push(key);
            this.values.push(value);
            this.publish("add", "STATE", "Key: " + key + " added");
            return;
        }
        this.publish("add", "FAIL", "Key: " + key + " exists");
    }
    has(key: string): boolean {
        return this.indexOf(key) > -1;
    }

    remove(key: string): void {
        let index = this.indexOf(key);
        if (index > -1) {
            this.removeIndex(index);
            this.publish("add", "STATE", "Key: " + key + " removed");
            return;
        }
        this.publish("add", "STATE", "Key: " + key + " not found");
    }

    get(key: string): T {
        let index = this.indexOf(key);
        if (index > -1) {
            return this.values[index];
        }
        this.publish("add", "STATE", "Key: " + key + " not found");
        return null;
    }

    count(): number {
        return this.keys.length;
    }

    clear(): void {
        this.keys = [];
        this.values = [];
        this.publish("clear", "STATE", "Finished");
    }

    shift(): T {
        this.keys.shift();
        return this.values.shift();
    }

    first(): T {
        return this.count() > 0 ? this.values[0] : null;
    }

    removeIndex(index: number) {
        if (index > -1 && this.values.length > index) {
            this.keys.splice(index, 1);
            this.values.splice(index, 1);
        }
    }

    private indexOf(key: string): number {
        return key ? this.keys.indexOf(key) : -1;
    }

    private publish(action: string, type: FlowEventType, message?: string) {
        if (this.#onEvent) {
            this.#onEvent(action, type, message);
        }
    }
}