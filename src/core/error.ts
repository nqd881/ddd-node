import { AnyModel } from "./model";

export class ModelError extends Error {
  constructor(model: AnyModel, message: string) {
    super(`[${model.getType()}] ${message}`);
  }
}
