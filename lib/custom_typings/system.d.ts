declare module 'system' {
  global {
    var web3: any;
    var require: (name: string) => any;
    var process: any;
    interface Window { web3: any; }
  }
}

declare module "*.json" {
  const value: any;
  export default value;
}

