export class Company {
  id: number;
  name: string;
  code: string;
  city: string;
  pin_code: string;
  country_id: number;
  type: string;
  person: string;
  email: string;
  phone: string;
  address: string;
  reference: string;
  remarks: string;
  website: string;
  status: number;

  constructor(company) {
    this.id = company.id;
    this.name = company.name;
    this.code = company.code;
    this.reference = company.reference;
    this.city = company.city;
    this.pin_code = company.pin_code;
    this.country_id = company.country_id;
    this.person = company.person;
    this.email = company.email;
    this.phone = company.phone;
    this.type = company.type;
    this.address = company.address;
    this.remarks = company.remarks;
    this.website = company.website;
    this.status  = company.status;
  }
}
