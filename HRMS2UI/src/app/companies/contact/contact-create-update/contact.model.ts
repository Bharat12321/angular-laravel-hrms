export class Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  remarks: string;
  status: number;

  constructor(contact) {
    this.id = contact.id;
    this.name = contact.name;
    this.email = contact.email;
    this.phone = contact.phone;
    this.remarks = contact.remarks;
    this.status  = contact.status;
  }
}
