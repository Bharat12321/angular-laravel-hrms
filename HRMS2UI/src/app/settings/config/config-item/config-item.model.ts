export class ConfigItem {
  id: number;
  name: string;
  description: string;
  status: number;

  constructor(setting) {
    this.id = setting.id;
    this.name = setting.name;
    this.description = setting.description;
    this.status = setting.status;
  }
}
