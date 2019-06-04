export class LPO {
  id: number;
  date :string; 
  due_date :string; 
  total :string;
  amount :string;
  remarks :string;
  status: number;

  constructor(lpo) {
    this.id = lpo.id;
    this.date = lpo.date;
    this.due_date = lpo.due_date;
    this.total = lpo.total;
    this.amount = lpo.amount;
    this.remarks = lpo.remarks;
    this.status = lpo.status;
  }
}
