export class Due {
  id: number;
  code: string;
  first_name :string; 
  middle_name :string; 
  last_name :string; 
  country_id :string; 
  category_id :string; 
  course_id :string;
  batch_id :string;
  gender :string; 
  dob :string; 
  email_id :string; 
  blood_group :string; 
  birth_place :string; 
  religion :string; 
  admission_date :string;
  photo :string;
  languages :string; 
  mobile_no :string; 
  passport_no :string;
  height :string;
  weight :string;
  status: number;

  constructor(due) {
    this.id = due.id;
    this.code = due.code;
    this.first_name = due.first_name;
    this.middle_name = due.middle_name;
    this.last_name = due.last_name;
    this.country_id = due.country_id;
    this.category_id = due.category_id;
    this.course_id = due.course_id;
    this.batch_id = due.batch_id;
    this.gender = due.gender;
    this.dob = due.dob;
    this.email_id = due.email_id;
    this.blood_group = due.blood_group;
    this.birth_place = due.birth_place;
    this.religion = due.religion;
    this.admission_date = due.admission_date;
    this.languages = due.languages;
    this.mobile_no = due.mobile_no;
    this.passport_no = due.passport_no;
    this.height = due.height;
    this.weight = due.weight;
    this.status = due.status;
  }
}
