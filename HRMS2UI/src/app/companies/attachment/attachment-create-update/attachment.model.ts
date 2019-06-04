export class Attachment {
  id: number;
  number: string;
  expiry_date: string;
  location: string;
  remarks: string;
  type_id: number;
  status: number;

  constructor(attachment) {
    this.id = attachment.id;
    this.number = attachment.number;
    this.expiry_date = attachment.expiry_date;
    this.location = attachment.location;
    this.type_id = attachment.type_id;
    this.remarks = attachment.remarks;
    this.status = attachment.status;
  }
}
