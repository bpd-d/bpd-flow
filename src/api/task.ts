export class FlowTask<T> {
    #onFinish: (t: T) => void;
    #onError: (e: Error) => void;
    id: string;

    constructor(id: string) {
        this.#onError = null;
        this.#onFinish = null;
        this.id = "FlowTask-" + id;
    }

    update(result: T, err?: Error) {
        if (err && this.#onError) {
            this.#onError(err)
        } else if (result && this.#onFinish) {
            this.#onFinish(result);
        }
    }

    finish(onFinish: (t: T) => void): FlowTask<T> {
        this.#onFinish = onFinish;
        return this;
    }

    error(onError: (e: Error) => void): FlowTask<T> {
        this.#onError = onError;
        return this;
    }
}