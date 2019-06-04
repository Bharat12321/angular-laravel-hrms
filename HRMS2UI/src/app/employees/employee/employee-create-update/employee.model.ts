export class Employee {
  id: number;
  name: string;
  code: string;
  arabic_name: string;
  class_id: number;
  date_of_birth: string;
  contact_number: string;
  email: string;
  joining_date: string;
  country_id: number;
  joining_type_id: number;
  type_id: number;
  organization_id: number;
  department_id: number;
  designation_id: number;
  category_id: number;
  grade_id: number;
  sponsor_id: number;
  bank_id: number;
  account_number: string;
  iban: string;
  salary: string;
  working_status_id: number;
  payrol_center_id: number;
  gender: string;
  remarks: string;
  status: number;

  constructor(employee) {
    this.id = employee.id;
    this.name = employee.name;
    this.code = employee.code;
    this.arabic_name = employee.arabic_name;
    this.class_id = employee.class_id;
    this.contact_number = employee.contact_number;
    this.date_of_birth = employee.date_of_birth;
    this.email = employee.email;
    this.joining_date = employee.joining_date;
    this.country_id = employee.country_id;
    this.joining_type_id = employee.joining_type_id;
    this.type_id = employee.type_id;
    this.organization_id = employee.organization_id;
    this.department_id = employee.department_id;
    this.designation_id = employee.designation_id;
    this.category_id = employee.category_id;
    this.grade_id = employee.grade_id;
    this.sponsor_id = employee.sponsor_id;
    this.bank_id = employee.bank_id;
    this.account_number = employee.account_number;
    this.iban = employee.iban;
    this.salary = employee.salary;
    this.working_status_id = employee.working_status_id;
    this.payrol_center_id = employee.payrol_center_id;
    this.gender = employee.gender;
    this.remarks = employee.remarks;
    this.status = employee.status;
  }
}
