export class Activity {
  id: number;
  type_id: number;
  date: string;
  notification_date: string;
  remarks: string;
  status: number;

  constructor(activity) {
    this.id = activity.id;
    this.type_id = activity.type_id;
    this.date = activity.date;
    this.notification_date = activity.notification_date;
    this.remarks = activity.remarks;
    this.status = activity.status;
  }
}
