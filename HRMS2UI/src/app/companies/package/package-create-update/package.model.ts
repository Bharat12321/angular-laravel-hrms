export class Packages {
  id: number;
  name: string;
  description: string;
  package_category:number;
  price:number;
  sessions: number;
  status: number;
  constructor(packages) {
    this.id = packages.id;
    this.name = packages.name;
    this.description = packages.description;
    this.package_category = packages.package_category;
    this.price = packages.price;
    this.sessions = packages.sessions;
    this.status = packages.status;
  }
}
