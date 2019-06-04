<?php

namespace App\Models\Sales;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Sales\Sale;
use App\Models\Core\Item;
use App\Models\Core\Config;

class SaleDetail extends Model
{
      use SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];
    protected $table = 'sale_details';	
    /**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
           'sale_id',
           'sale_type_id',
           'item_id',
           'employee_id',
           'quantity',
           'price',
           'total_price',        
           'status'
	];


  /**
   * Get the category.
   */
  public function sale()
  {
      return $this->belongsTo(Sales::class);
  }
  /**
   * Get the category.
   */
  public function item()
  {
      return $this->belongsTo(Items::class);
  }
  public function sale_type()
  {
      return $this->belongsTo(Config::class);
  }
  public function employee()
  {
      return $this->belongsTo(Employees::class);
  }
}
