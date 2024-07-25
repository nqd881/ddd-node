import { afterEach, describe } from "mocha";
import {
  Event,
  EventBase,
  EventPublisher,
  EventSubscriber,
  EventSubscriberRegistry,
  StateAggregateBase,
  StateAggregateBuilder,
  SubscribeToEvents,
} from "../src";
import { expect } from "chai";

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

eventSubscriberRegistry.registerSubscriber(new TestEventSubscriber());
eventSubscriberRegistry.registerSubscriber(new CompositeTestEventSubscriber());

const eventPublisher = new EventPublisher(eventSubscriberRegistry);

describe("Event Pubsub", function () {
  const aggregate = new StateAggregateBuilder(TestAggregate)
    .withProps({})
    .build();

  afterEach(() => {
    count.value = 0;
    aggregate.clearEvents();
  });

  it("Test event handled", async () => {
    aggregate.action1();

    const events = aggregate.events();

    await Promise.all(events.map((event) => eventPublisher.publish(event)));

    expect(count.value).equals(3);
  });

  it("Test2 event handled", async () => {
    aggregate.action2();

    const events = aggregate.events();

    await Promise.all(events.map((event) => eventPublisher.publish(event)));

    expect(count.value).equals(4);
  });
});
