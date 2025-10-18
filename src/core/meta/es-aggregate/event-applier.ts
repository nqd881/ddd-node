import "reflect-metadata";
import { AnyEvent, EventApplier } from "../../model";

const OWN_EVENT_APPLIER_MAP = Symbol.for("OWN_EVENT_APPLIER_MAP");
const EVENT_APPLIER_MAP = Symbol.for("EVENT_HANDLER_MAP");

export class EventApplierMap extends Map<string, EventApplier> {}

export const getOwnEventApplierMap = (target: object): EventApplierMap => {
  if (!Reflect.hasOwnMetadata(OWN_EVENT_APPLIER_MAP, target))
    Reflect.defineMetadata(
      OWN_EVENT_APPLIER_MAP,
      new EventApplierMap(),
      target
    );

  return Reflect.getMetadata<EventApplierMap>(OWN_EVENT_APPLIER_MAP, target)!;
};

export const defineEventApplier = <T extends AnyEvent>(
  target: object,
  eventType: string,
  applier: EventApplier<T>
) => {
  const eventAppliersMap = getOwnEventApplierMap(target);

  eventAppliersMap.set(eventType, applier as EventApplier);
};

export const getEventApplierMap = (target: object): EventApplierMap => {
  if (!Reflect.hasOwnMetadata(EVENT_APPLIER_MAP, target)) {
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
        ownEventApplierMap.forEach((eventApplier, eventType) => {
          result.set(eventType, eventApplier);
        });
      });

      return result;
    };

    Reflect.defineMetadata(
      EVENT_APPLIER_MAP,
      buildEventApplierMap(target),
      target
    );
  }

  return Reflect.getOwnMetadata<EventApplierMap>(EVENT_APPLIER_MAP, target)!;
};
