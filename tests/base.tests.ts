import { TestAction, ActionsInputs, ActionsOutputs, TestAction2, TestActionLong } from "./static/actions"
import { FlowActionManager, Flow } from "../src";
import { sleep } from "./static/functions";

describe("Tests for class [FlowActionManager]", function () {

    beforeEach(() => {

    })

    it("Simple test, one subscriber, one perform", async function () {
        let action = new TestAction();
        let manager = new FlowActionManager(action);
        let res = -1;
        const sub = manager.subscribe();
        sub.finish((result) => { res = result; })
        manager.perform(1);
        await sleep(10);
        expect(res).toEqual(2);
    })

    it("Simple test, one subscriber, two performs", async function () {
        let action = new TestAction();
        let manager = new FlowActionManager(action);
        let res = -1;
        const sub = manager.subscribe();
        sub.finish((result) => { res = result; })
        manager.perform(1);
        manager.perform(2);
        await sleep(10);
        expect(res).toEqual(3);
    })

    it("Simple test, many subscribers, one perform", async function () {
        let action = new TestAction();
        let manager = new FlowActionManager(action);
        let res = -1;
        let res2 = -1;
        const sub = manager.subscribe();
        const sub2 = manager.subscribe();
        sub.finish((result) => { res = result; })
        sub2.finish((result) => { res2 = result; })
        manager.perform(1);
        await sleep(10);
        expect(res).toEqual(2);
        expect(res2).toEqual(2);
    })

    it("Simple test, many subscribers, two performs", async function () {
        let action = new TestAction();
        let manager = new FlowActionManager(action);
        let res = -1;
        let res2 = -1;
        const sub = manager.subscribe();
        const sub2 = manager.subscribe();
        sub.finish((result) => { res = result; })
        sub2.finish((result) => { res2 = result; })
        manager.perform(1);
        manager.perform(2);
        await sleep(10);
        expect(res).toEqual(3);
        expect(res2).toEqual(3);
    })

    it("Simple test, one subscriber, two long performs", async function () {
        let action = new TestActionLong();
        let manager = new FlowActionManager(action);
        let res = -1;
        let res2 = -1;

        const sub = manager.subscribe();
        sub.finish((result) => { res = result; })
        manager.perform(1);
        manager.perform(2);
        let stats = manager.getStats();
        await sleep(250);
        res2 = res;
        await sleep(250);
        let stats2 = manager.getStats();
        expect(stats.queueCount).toEqual(2);
        expect(stats2.queueCount).toEqual(0);
        expect(res).toEqual(3);
        expect(res2).toEqual(2);
    })

})

describe("Tests for class [Flow]", function () {

    beforeEach(() => {

    })

    it("Simple test, many actions", async function () {
        const flow = new Flow<ActionsInputs, ActionsOutputs>(new TestAction(), new TestAction2());
        let sub = flow.subscribe("TestAction");
        let sub2 = flow.subscribe("TestAction2");
        let res = -1;
        let res2 = "?";
        sub.finish((val: number) => {
            res = val;
        });
        sub2.finish((val: string) => {
            res2 = val;
        })

        flow.perform("TestAction", 1);
        flow.perform("TestAction2", "1");
        await sleep(10);
        expect(res).toEqual(2);
        expect(res2).toEqual("11");

    })

})