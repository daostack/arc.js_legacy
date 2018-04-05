declare module "system" {
  global {
    interface Window { web3: any; }
    var window: Window;
    var artifacts: any;
  }
}

declare module "*.json" {
  const value: any;
  export default value;
}
