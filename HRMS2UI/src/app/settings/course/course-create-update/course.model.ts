export class Course {
  id: number;
  name: string;
  duration: number;
  category_id: number;
  original_price: string;
  discount_price: string;
  remarks: string;
  status: number;

  constructor(course) {
    this.id = course.id;
    this.name = course.name;
    this.category_id = course.category_id;
    this.duration = course.duration;
    this.original_price = course.original_price;
    this.discount_price = course.discount_price;
    this.remarks = course.remarks;
    this.status = course.status;
  }
}
