export class Sale {
  id: number;
  company_id: number;
  employee_id:number;
  sale_type_id:number;
  name: string;
  item_id: any;
  item_quantity :any; 
  item_price :any;  
  discount :string;
  total_price :string; 
  payment_type :string; 
  type_id :number; 
  mode_id :number; 
  reference :string; 
  paid_amount :string;
  due_amount :string;
  remarks :string; 
  details :any; 
  status: number;

  constructor(sale) {
    this.id = sale.id;
    this.company_id = sale.company_id;
    this.employee_id = sale.employee_id;
    this.sale_type_id = sale.sale_type_id;
    this.name = sale.name;
    this.item_id = sale.item_id;
    this.item_quantity = sale.item_quantity;
    this.item_price = sale.item_price;
    this.discount = sale.discount;
    this.total_price = sale.total_price;
    this.payment_type = sale.payment_type;
    this.type_id = sale.type_id;
    this.mode_id = sale.mode_id;
    this.reference = sale.reference;
    this.paid_amount = sale.paid_amount;
    this.due_amount = sale.due_amount;
    this.remarks = sale.remarks;
    this.details = sale.details;
    this.status = sale.status;
  }
}
