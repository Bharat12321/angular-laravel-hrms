export class Sponsor {
  id: number;
  name: string;
  code: string;
  company_name: string;
  employer_eid: string;
  payer_eid: string;
  id_expiry_date: string;
  remarks: string;
  status: number;

  constructor(sponsor) {
    this.id = sponsor.id;
    this.name = sponsor.name;
    this.code = sponsor.code;
    this.company_name = sponsor.company_name;
    this.employer_eid = sponsor.employer_eid;
    this.payer_eid = sponsor.payer_eid;
    this.id_expiry_date = sponsor.id_expiry_date;
    this.remarks = sponsor.remarks;
    this.status = sponsor.status;
  }
}
