export class Invoice {
  id: number;
  date :string; 
  due_date :string; 
  total :string;
  amount :string;
  remarks :string;
  status: number;

  constructor(invoice) {
    this.id = invoice.id;
    this.date = invoice.date;
    this.due_date = invoice.due_date;
    this.total = invoice.total;
    this.amount = invoice.amount;
    this.remarks = invoice.remarks;
    this.status = invoice.status;
  }
}
