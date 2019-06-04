export class Payment {
  id: number;
  category_id: number;
  taggable_id: string;
  taggable_type :string; 
  amount_payable :string; 
  amount_paid :string; 
  type_id :number; 
  mode_id :number; 
  reference :string; 
  paid_date :string;
  payment_date :string;
  remarks :string; 
  status: number;

  constructor(payment) {
    this.id = payment.id;
    this.category_id = payment.category_id;
    this.taggable_id = payment.taggable_id;
    this.taggable_type = payment.taggable_type;
    this.amount_payable = payment.amount_payable;
    this.amount_paid = payment.amount_paid;
    this.type_id = payment.type_id;
    this.mode_id = payment.mode_id;
    this.reference = payment.reference;
    this.paid_date = payment.paid_date;
    this.payment_date = payment.payment_date;
    this.remarks = payment.remarks;
    this.status = payment.status;
  }
}
