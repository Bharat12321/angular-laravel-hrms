export class Role {
  id: number;
  name: string;
  permissions: any;

  constructor(role) {
    this.id = role.id;
    this.name = role.name;
    this.permissions = role.permissions;
  }
}
