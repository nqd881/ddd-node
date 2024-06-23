import "reflect-metadata";
import { AnyEvent, EventApplier } from "../../core";

export class EventApplierMap extends Map<string, EventApplier> {}

export const OwnEventApplierMapMetaKey = Symbol.for("OWN_EVENT_APPLIER_MAP");

export const getOwnEventApplierMap = (target: object): EventApplierMap => {
  if (!Reflect.hasOwnMetadata(OwnEventApplierMapMetaKey, target))
    Reflect.defineMetadata(
      OwnEventApplierMapMetaKey,
      new EventApplierMap(),
      target
    );

  return Reflect.getMetadata<EventApplierMap>(
    OwnEventApplierMapMetaKey,
    target
  )!;
};

export const defineEventApplier = <T extends AnyEvent>(
  target: object,
  eventType: string,
  applier: EventApplier<T>
) => {
  const eventAppliersMap = getOwnEventApplierMap(target);

  eventAppliersMap.set(eventType, applier as EventApplier);
};

export const EventApplierMapMetaKey = Symbol.for("EVENT_HANDLER_MAP");

export const getEventApplierMap = (target: object): EventApplierMap => {
  if (!Reflect.hasOwnMetadata(EventApplierMapMetaKey, target)) {
    const buildEventApplierMap = (target: object) => {
      let _target: object | null = target;

      const result: EventApplierMap = new EventApplierMap();

      const ownEventApplierMaps: EventApplierMap[] = [];

      do {
        const ownEventApplierMap = getOwnEventApplierMap(_target);

        ownEventApplierMaps.unshift(ownEventApplierMap);

        _target = Reflect.getPrototypeOf(_target);
      } while (_target !== null);

      ownEventApplierMaps.forEach((ownEventApplierMap) => {
        ownEventApplierMap.forEach((eventApplier, methodName) => {
          result.set(methodName, eventApplier);
        });
      });

      return result;
    };

    Reflect.defineMetadata(
      EventApplierMapMetaKey,
      buildEventApplierMap(target),
      target
    );
  }

  return Reflect.getOwnMetadata<EventApplierMap>(
    EventApplierMapMetaKey,
    target
  )!;
};
