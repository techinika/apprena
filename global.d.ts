// global.d.ts

declare global {
  interface GlobalThis {
    IremboPay: {
      initiate: (options: {
        publicKey: string;
        invoiceNumber: string;
        locale: string;
      }) => void;
      locale: {
        EN: string;
      };
    };
  }
}

export {};
