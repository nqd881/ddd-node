export class HasNotBeenSetError extends Error {
  constructor(x: string) {
    super(`The ${x} has not been set`);
  }
}

export class AggregateTypeHasNotBeenSetError extends HasNotBeenSetError {
  constructor() {
    super("aggregate type");
  }
}

export class CommandTypeHasNotBeenSetError extends HasNotBeenSetError {
  constructor() {
    super("command type");
  }
}

export class EntityTypeHasNotBeenSetError extends HasNotBeenSetError {
  constructor() {
    super("entity type");
  }
}

export class EventTypeHasNotBeenSetError extends HasNotBeenSetError {
  constructor() {
    super("event type");
  }
}

export class ValueObjectTypeHasNotBeenSetError extends HasNotBeenSetError {
  constructor() {
    super("value object type");
  }
}
