export class Course {
  id: number;
  company_id: number;
  course_id: number;
  quantity: number;
  discount: number;
  remarks: string;
  date:string;
  status: number;

  constructor(course) {
    this.id = course.id;
    this.company_id = course.company_id;
    this.course_id = course.course_id;
    this.quantity = course.quantity;
    this.discount = course.discount;
    this.date = course.date;
    this.remarks = course.remarks;
    this.status = course.status;
  }
}
