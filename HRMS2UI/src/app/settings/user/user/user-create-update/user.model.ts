export class User {
  id: number;
  name: string;
  username: string;
  role_id: number;

  constructor(user) {
    this.id = user.id;
    this.name = user.name;
    this.username = user.username;
    this.role_id = user.role_id;
  }
}
