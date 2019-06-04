export class Quotation {
  id: number;
  date :string; 
  due_date :string; 
  total :string;
  amount :string;
  remarks :string;
  status: number;

  constructor(quotation) {
    this.id = quotation.id;
    this.date = quotation.date;
    this.due_date = quotation.due_date;
    this.total = quotation.total;
    this.amount = quotation.amount;
    this.remarks = quotation.remarks;
    this.status = quotation.status;
  }
}
