export class Category {
  id: number;
  name: string;
  class :string; 
  status: number;

  constructor(category) {
    this.id = category.id;
    this.name = category.name;
    this.class = category.class;
    this.status = category.status;
  }
}
