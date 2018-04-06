declare module "system" {
  global {
    var window: Window;
    var artifacts: any;
  }
}

declare module "*.json" {
  const value: any;
  export default value;
}
