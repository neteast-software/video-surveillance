/// <reference types="vite/client" />
declare interface Window {
  T: any;
}

declare module 'linker-uii' {
  const value: any;
  export default value;
  export const Viewer: any;
  export const LkNaiveProvider: any;
}
