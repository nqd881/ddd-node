"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventApplierMap = exports.EventApplierMapMetaKey = exports.defineEventApplier = exports.getOwnEventApplierMap = exports.OwnEventApplierMapMetaKey = exports.EventApplierMap = void 0;
require("reflect-metadata");
class EventApplierMap extends Map {
}
exports.EventApplierMap = EventApplierMap;
exports.OwnEventApplierMapMetaKey = Symbol.for("OWN_EVENT_APPLIER_MAP");
const getOwnEventApplierMap = (target) => {
    if (!Reflect.hasOwnMetadata(exports.OwnEventApplierMapMetaKey, target))
        Reflect.defineMetadata(exports.OwnEventApplierMapMetaKey, new EventApplierMap(), target);
    return Reflect.getMetadata(exports.OwnEventApplierMapMetaKey, target);
};
exports.getOwnEventApplierMap = getOwnEventApplierMap;
const defineEventApplier = (target, eventType, applier) => {
    const eventAppliersMap = (0, exports.getOwnEventApplierMap)(target);
    eventAppliersMap.set(eventType, applier);
};
exports.defineEventApplier = defineEventApplier;
exports.EventApplierMapMetaKey = Symbol.for("EVENT_HANDLER_MAP");
const getEventApplierMap = (target) => {
    if (!Reflect.hasOwnMetadata(exports.EventApplierMapMetaKey, target)) {
        const buildEventApplierMap = (target) => {
            let _target = target;
            const result = new EventApplierMap();
            const ownEventApplierMaps = [];
            do {
                const ownEventApplierMap = (0, exports.getOwnEventApplierMap)(_target);
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
        Reflect.defineMetadata(exports.EventApplierMapMetaKey, buildEventApplierMap(target), target);
    }
    return Reflect.getOwnMetadata(exports.EventApplierMapMetaKey, target);
};
exports.getEventApplierMap = getEventApplierMap;
