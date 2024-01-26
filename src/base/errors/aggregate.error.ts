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
      "The event must have the aggregate type equal to the type of the aggregate instance"
    );
  }
}

export class InvalidEventAggregateIdError extends Error {
  constructor() {
    super(
      "The event must have the aggregate id equal to the id of the aggregate instance"
    );
  }
}

export class InvalidEventAggregateVersionError extends Error {
  constructor() {
    super(
      "The event must have the aggregate version equal to the next version of the aggregate instance"
    );
  }
}

export class InvalidCommandAggregateTypeError extends Error {
  constructor() {
    super(
      "The command must have the aggregate type equal to the type of the aggregate instance"
    );
  }
}
