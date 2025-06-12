import { AnyModel, ModelClass } from "../model";
export declare const ModelDomainMetaKey: unique symbol;
export declare const defineModelDomain: <T extends AnyModel>(target: ModelClass<T>, domainName: string) => void;
export declare const getModelDomain: <T extends AnyModel>(target: ModelClass<T>) => string;
