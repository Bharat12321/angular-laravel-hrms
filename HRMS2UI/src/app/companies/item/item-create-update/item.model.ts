export class Item {
  id: number;
  itemname: string;
  itemcode: string;
  barcode: string;
  item_category_id:number;
  item_manufacturar_id:number;
  item_shelf_id: number;
  item_row_id: number;
  item_col_id: number;
  uom_id:number;
  rol:number; 
  status: number;
  constructor(item) {
    this.id = item.id;
    this.itemname = item.itemname;
    this.itemcode = item.itemcode;
    this.barcode = item.barcode;
    this.item_category_id = item.item_category_id;
    this.item_manufacturar_id = item.item_manufacturar_id;
    this.item_shelf_id = item.item_shelf_id;
    this.item_row_id = item.item_row_id;
     this.item_col_id = item.item_col_id;
    this.uom_id = item.uom_id;
    this.rol = item.rol;
    this.status = item.status;
  }
}
