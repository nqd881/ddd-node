import { expect } from "chai";
import { afterEach, describe } from "mocha";
import {
  AnyEvent,
  IsEvent,
  Event,
  EventDispatcher,
  EventSubscriber,
  EventSubscriberRegistry,
  IGlobalEventSubscriber,
  StateAggregate,
  SubscribeToEvents,
} from "../src";
import { v4 } from "uuid";

const count = { value: 0 };

interface TestEventProps {
  propX: string;
}

@IsEvent("TEST")
class TestEvent extends Event<TestEventProps> {}

const x = TestEvent.modelDescriptor();

interface Test2EventProps {
  propY: string;
}

@IsEvent("TEST2")
class Test2Event extends Event<Test2EventProps> {}

class TestGlobalEventSubscriber implements IGlobalEventSubscriber {
  async handleEvent(event: AnyEvent): Promise<void> {
    count.value++;
  }
}

@SubscribeToEvents(TestEvent)
class TestEventSubscriber extends EventSubscriber<TestEvent> {
  async handleEvent(event: TestEvent): Promise<void> {
    count.value++;
  }
}

@SubscribeToEvents([TestEvent, Test2Event])
class CompositeTestEventSubscriber extends EventSubscriber<
  TestEvent | Test2Event
> {
  async handleEvent(event: TestEvent | Test2Event): Promise<void> {
    if (event instanceof TestEvent) count.value += 2;
    else if (event instanceof Test2Event) count.value += 4;
  }
}

interface TestAggregateProps {}

class TestAggregate extends StateAggregate<TestAggregateProps> {
  action1() {
    this.recordEvent(TestEvent, {
      propX: "Test event value",
    });
  }

  action2() {
    this.recordEvent(Test2Event, {
      propY: "Test 2 event value",
    });
  }
}

const eventSubscriberRegistry = new EventSubscriberRegistry();

eventSubscriberRegistry.registerGlobalSubscriber(
  new TestGlobalEventSubscriber()
);

eventSubscriberRegistry.registerSubscriber(new TestEventSubscriber());
eventSubscriberRegistry.registerSubscriber(new CompositeTestEventSubscriber());

const eventDispatcher = new EventDispatcher(eventSubscriberRegistry);

describe("Handling Event", function () {
  const aggregate = new TestAggregate({ id: v4(), version: 0 }, {});

  afterEach(() => {
    count.value = 0;
    aggregate.clearEvents();
  });

  it("Test event handled", async () => {
    aggregate.action1();

    const events = aggregate.events();

    await Promise.all(events.map((event) => eventDispatcher.dispatch(event)));

    expect(count.value).equals(4);
  });

  it("Test2 event handled", async () => {
    aggregate.action2();

    const events = aggregate.events();

    await Promise.all(events.map((event) => eventDispatcher.dispatch(event)));

    expect(count.value).equals(5);
  });

  it("Test1 & Test2 events handled", async () => {
    aggregate.action1();
    aggregate.action2();

    const events = aggregate.events();

    await Promise.all(events.map((event) => eventDispatcher.dispatch(event)));

    expect(count.value).equals(9);
  });
});
