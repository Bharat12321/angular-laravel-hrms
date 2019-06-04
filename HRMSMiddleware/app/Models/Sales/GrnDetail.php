<?php

namespace App\Models\Sales;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Sales\Grn;
use App\Models\Sales\Item;
use App\Models\Core\Config;

class GrnDetail extends Model
{
      use SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];
    protected $table = 'grn_details';	
    /**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
           'grn_id',
           'item_id',
           'quantity',
           'price',
           'selling_price',
           'uom',
           'status'
	];


  /**
   * Get the category.
   */
  public function Grn()
  {
      return $this->belongsTo(Grn::class);
  }
  /**
   * Get the category.
   */
  public function item()
  {
      return $this->belongsTo(Item::class);
  }
  public function Uom()
  {
      return $this->belongsTo(Config::class);
  }
}
