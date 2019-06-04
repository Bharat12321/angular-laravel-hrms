export class Organization {
  id: number;
  name: string;
  code: string;
  company_name: string;
  country_id: number;
  city: string;
  address: string;
  pin_code: string;
  remarks: string;
  status: number;

  constructor(organization) {
    this.id = organization.id;
    this.name = organization.name;
    this.code = organization.code;
    this.company_name = organization.company_name;
    this.country_id = organization.country_id;
    this.city = organization.city;
    this.address = organization.address;
    this.pin_code = organization.pin_code;
    this.remarks = organization.remarks;
    this.status = organization.status;
  }
}
