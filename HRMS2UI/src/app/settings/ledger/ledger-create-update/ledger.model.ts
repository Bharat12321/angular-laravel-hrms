export class Ledger {
  id: number;
  name: number;
  address :string; 
  remarks :string;
  status: number;

  constructor(ledger) {
    this.id = ledger.id;
    this.name = ledger.name;
    this.address = ledger.address;
    this.remarks = ledger.remarks;
    this.status = ledger.status;
  }
}
