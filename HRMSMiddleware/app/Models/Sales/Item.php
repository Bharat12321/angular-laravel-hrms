<?php

namespace App\Models\Sales;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Core\Config;


class Item extends Model
{
    
    use SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];
    protected $table = 'items';	
    /**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
           'itemname',
           'itemcode',
           'barcode',
           'item_category_id',
           'item_manufacturar_id',
           'item_shelf_id',
           'item_row_id',
           'item_col_id',
           'uom_id',
           'rol',
           'status'
	];

  /**
   * Get the category.
   */
  public function item_category()
  {
      return $this->belongsTo(Config::class);
  }
  public function item_manufacturar()
  {
      return $this->belongsTo(Config::class);
  }
  public function item_shelf()
  {
      return $this->belongsTo(Config::class);
  }
  public function item_row()
  {
      return $this->belongsTo(Config::class);
  }
  public function item_col()
  {
      return $this->belongsTo(Config::class);
  }
  public function uom()
  {
      return $this->belongsTo(Config::class);
  }
  
}
