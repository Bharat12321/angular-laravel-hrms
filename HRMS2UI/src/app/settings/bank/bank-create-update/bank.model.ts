export class Bank {
  id: number;
  name: string;
  code: string;
  status: number;

  constructor(bank) {
    this.id = bank.id;
    this.name = bank.name;
    this.code = bank.code;
    this.status = bank.status;
  }
}
