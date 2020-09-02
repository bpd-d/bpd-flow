import { FlowAction } from "../../src/index";
import { sleep } from "./functions";

export class TestAction implements FlowAction<number, number> {
    name: string;
    constructor() {
        this.name = "TestAction";
    }

    async perform(t?: number): Promise<number> {
        return t ? t + 1 : -1;
    }

}

export class TestAction2 implements FlowAction<string, string> {
    name: string;
    constructor() {
        this.name = "TestAction2";
    }

    async perform(t?: string): Promise<string> {
        return t ? t + "1" : "#";
    }

}

export class TestActionLong implements FlowAction<number, number> {
    name: string;
    constructor() {
        this.name = "TestActionLong";
    }

    async perform(t?: number): Promise<number> {
        await sleep(200);
        return t ? t + 1 : -1;
    }

}

export type ActionsInputs = number | string;
export type ActionsOutputs = number | string;