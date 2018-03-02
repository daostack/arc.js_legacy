declare module "system" {
  global {
    var web3: any;
    interface Window { web3: any; }
    var window: Window;
  }
}

declare module "*.json" {
  const value: any;
  export default value;
}
