export {};

declare global {
  namespace Ticket {
    interface Config {
      prefix: string;
      parentID: string;
      owners: string[];
      categorys: string[];
      supportOfficer: string;
    }
  }
}
