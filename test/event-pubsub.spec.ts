import { expect } from "chai";
import { afterEach, describe } from "mocha";
import {
  AnyEvent,
  Event,
  EventBase,
  EventPublisher,
  EventSubscriber,
  EventSubscriberRegistry,
  IGlobalEventSubscriber,
  StateAggregateBase,
  SubscribeToEvents,
} from "../src";

const count = { value: 0 };

interface TestEventProps {
  propX: string;
}

@Event("TEST")
class TestEvent extends EventBase<TestEventProps> {}

interface Test2EventProps {
  propY: string;
}

@Event("TEST2")
class Test2Event extends EventBase<Test2EventProps> {}

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

class TestAggregate extends StateAggregateBase<TestAggregateProps> {
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

const eventPublisher = new EventPublisher(eventSubscriberRegistry);

describe("Event Pubsub", function () {
  const aggregate = TestAggregate.builder().withProps({}).build();

  afterEach(() => {
    count.value = 0;
    aggregate.clearEvents();
  });

  it("Test event handled", async () => {
    aggregate.action1();

    const events = aggregate.events();

    await Promise.all(events.map((event) => eventPublisher.publish(event)));

    expect(count.value).equals(4);
  });

  it("Test2 event handled", async () => {
    aggregate.action2();

    const events = aggregate.events();

    await Promise.all(events.map((event) => eventPublisher.publish(event)));

    expect(count.value).equals(5);
  });

  it("Test1 & Test2 events handled", async () => {
    aggregate.action1();
    aggregate.action2();

    const events = aggregate.events();

    await Promise.all(events.map((event) => eventPublisher.publish(event)));

    expect(count.value).equals(9);
  });
});
