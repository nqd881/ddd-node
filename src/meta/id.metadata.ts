import { IIdService, Uuid4Service } from "../core";

export const IdServiceMetaKey = Symbol.for("ID_SERVICE");

export const defineIdService = (target: object, idService: IIdService) => {
  Reflect.defineMetadata(IdServiceMetaKey, idService, target);
};

export const getIdService = (target: object): IIdService => {
  const idService = () => Reflect.getMetadata(IdServiceMetaKey, target);

  if (idService()) return idService();

  Reflect.defineMetadata(IdServiceMetaKey, new Uuid4Service(), target);

  return idService();
};
