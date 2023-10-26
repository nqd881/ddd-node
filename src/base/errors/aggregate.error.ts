export class PastEventCannotBeAddedError extends Error {
  constructor() {
    super("Past event cannot be added once a new event has been added");
  }
}

export class EventApplierNotFoundError extends Error {
  constructor(eventType: string) {
    super(`Not found event applier for event with type ${eventType}`);
  }
}

export class CommandHandlerNotFoundError extends Error {
  constructor(commandType: string) {
    super(`Not found command handler for command with type ${commandType}`);
  }
}

export class InvalidEventAggregateTypeError extends Error {
  constructor() {
    super(
      "The event must have the aggregateType is equal to the type of the aggregate that applied that event"
    );
  }
}

export class InvalidEventAggregateIdError extends Error {
  constructor() {
    super(
      "The event must have the aggregateId is equal to the id of the aggregate that applied that event"
    );
  }
}

export class InvalidEventAggregateVersionError extends Error {
  constructor() {
    super(
      "The event must have the aggregateVersion is equal to the next version of the aggregate that applied that event"
    );
  }
}
