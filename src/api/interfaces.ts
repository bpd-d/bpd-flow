import { FlowTask } from "./task";

export interface FlowAction<T, V> {
    name: string;
    perform(t?: T): Promise<V>;
}

// export interface FlowActions<T, V> {
//     [id: string]: FlowAction<T, V>;
// }


export type FlowEventType = "STATE" | "FAIL";


export interface IFlowEventCallback {
    (action: string, type: FlowEventType, message?: string): void;
}

export interface IFlowDict<T> {
    add(key: string, value: T): void;
    has(key: string): boolean;
    remove(key: string): void;
    get(key: string): T;
    count(): number;
    clear(): void;
    shift(): T;
    first(): T;
    removeIndex(index: number): void;
}

export interface Actions<T, V> {
    [name: string]: (t: T) => V;
}

export type TaskIdItem<T> = string | FlowTask<T>;

export interface OnFinishCallback<T> {
    (t: T): void;
}

export interface OnErrorCallback {
    (t: Error): void;
}

export interface TaskDetails<T> {
    task?: FlowTask<T>;
    finish?: OnFinishCallback<T>;
    error?: OnErrorCallback;
}