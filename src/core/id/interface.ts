export interface IIdService {
  validateValue(value: string): void;
  generateValue(): string;
}
