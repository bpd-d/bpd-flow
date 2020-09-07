import { FlowAction, Actions } from "./interfaces";

export class Action<T, V> implements FlowAction<T, V> {
    name: string;
    #callback: (t: T) => V;
    #ctx: any;
    constructor(name: string, callback: (t: T) => V, ctx?: any) {
        this.name = name;
        this.#callback = callback;
        this.#ctx = ctx;
    }

    async perform(t?: T): Promise<V> {
        if (this.#callback) {
            return this.#ctx ? this.#callback.apply(this.#ctx, t) : this.#callback(t);
        }
        return undefined;
    }
}


export function getActionListFromObj<T, V>(actions: Actions<T, V>): FlowAction<T, V>[] {
    let list: FlowAction<T, V>[] = [];
    for (let actionName in actions) {
        if (actions.hasOwnProperty(actionName) && typeof actions[actionName] === 'function') {
            list.push(new Action(actionName, actions[actionName]))
        }
    }
    return list;
}