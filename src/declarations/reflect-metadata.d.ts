declare namespace Reflect {
  function getMetadata<T = any>(
    metadataKey: any,
    target: Object
  ): T | undefined;

  function getMetadata<T = any>(
    metadataKey: any,
    target: Object,
    propertyKey: string | symbol
  ): T | undefined;

  function getOwnMetadata<T = any>(
    metadataKey: any,
    target: Object
  ): T | undefined;

  function getOwnMetadata<T = any>(
    metadataKey: any,
    target: Object,
    propertyKey: string | symbol
  ): T | undefined;
}
