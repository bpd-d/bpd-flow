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