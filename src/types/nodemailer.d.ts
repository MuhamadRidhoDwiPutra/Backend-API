declare module "nodemailer" {
  export interface Transporter {
    sendMail(message: any): Promise<any>;
  }

  export interface TestAccount {
    smtp: {
      host: string;
      port: number;
      secure: boolean;
    };
    user: string;
    pass: string;
  }

  export interface CreateTransportOptions {
    host: string;
    port: number;
    auth?: {
      user: string;
      pass: string;
    };
    secure?: boolean;
  }

  export function createTransport(options: CreateTransportOptions): Transporter;
  export function createTestAccount(): Promise<TestAccount>;
  export function getTestMessageUrl(info: any): string | false;

  const nodemailer: {
    createTransport: (options: CreateTransportOptions) => Transporter;
    createTestAccount: () => Promise<TestAccount>;
    getTestMessageUrl: (info: any) => string | false;
  };

  export default nodemailer;
}
