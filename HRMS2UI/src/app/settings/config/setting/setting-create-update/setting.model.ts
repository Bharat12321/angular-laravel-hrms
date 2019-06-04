export class Setting {
  id: number;
  name: string;
  description: string;
  sort: number;
  status: number;

  constructor(setting) {
    this.id = setting.id;
    this.name = setting.name;
    this.description = setting.description;
    this.sort = setting.sort;
    this.status = setting.status;
  }
}
