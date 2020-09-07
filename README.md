# bpd-flow
Library allowing for ease data flow management.
It suppose to work as a layer between UI components and service which provides data.

You can attach multiple components to one action (callback) and they will get updated every time action gets performed.
Actions invokes gets queued per argument value -  if you call multiple perfroms with different arguments, they will execute one after another.
On the other side if you call two perfroms with the same argument value, the will execute only once.

# Usage


# Examples
>Note!
>All examples are written in typescript

## First
1. Define your action(s). To do this implement **FlowAction<T, V>**.
```
export class TestAction implements FlowAction<string, string> {
    name: string;
    constructor() {
        this.name = "TestAction";
    }

    async perform(t?: string): Promise<string> {
        return t ? t + " foo" : "bar";
    }

}
```
2. Define your input and output type.
```
export type ActionsInputs = string;
export type ActionsOutputs = string;
```
>This step could be omitted in the example as we have only one action. But it is needed in cases where single flow has several actions.

3. Create instance on the Flow object in the root component:
```
const flow = FlowFactory.fromList<ActionsInputs, ActionsOutputs>(new TestAction());
```
Or

```
const flow = new Flow<ActionsInputs, ActionsOutputs>(new TestAction());
```

4. Add subscriptions in your child components.
```
let sub = flow.subscribe("TestAction");
```
5. Subscription needs a callback attached.
```
sub.finish((val: number) => {
            res = val;
        });
```
Optionally set onError callback if you want to capture errors occuring during action perform.

```
sub.finish((e: Error) => {
            console.log(e)
        });
```

6. Everytime you want your action to be perfromed call your flow object:
```
flow.perform("TestAction", "foo");
```
After action finished, all subscriptions get updated with data returned by the action.

# CHANGELOG
## [0.1.2] 2020-09-07
* [Added] - Additional check when creating FlowAction instance
* [Added] - Shorthands when subscribing to action - finish and error callback can be set when subscribing
## [0.1.1] 2020-09-07 - New features
* [Added] - Factory to create Flow objects: from object or from action list
## [0.1.0] 2020-09-02 - Initial release