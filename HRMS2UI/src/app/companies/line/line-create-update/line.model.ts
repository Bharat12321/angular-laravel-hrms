export class Line {
  id: number;
  company_id: number;
  course_id: number;
  quantity: number;
  discount: number;
  remarks: string;
  date:string;
  status: number;

  constructor(line) {
    this.id = line.id;
    this.company_id = line.company_id;
    this.course_id = line.course_id;
    this.quantity = line.quantity;
    this.discount = line.discount;
    this.date = line.date;
    this.remarks = line.remarks;
    this.status = line.status;
  }
}
