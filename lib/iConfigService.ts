export interface IConfigService {
  get(setting: string): any;
  set(setting: string, value: any): void;
}
