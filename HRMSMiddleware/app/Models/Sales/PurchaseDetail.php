<?php

namespace App\Models\Sales;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Sales\Purchase;
use App\Models\Core\Course;

class SaleDetail extends Model
{
      use SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];
    protected $table = 'purchase_details';	
    /**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
           'purchase_id',
           'item_id',
           'quantity',
           'price',
           'discount',
           'total_price','uom',
           'status'
	];


  /**
   * Get the category.
   */
  public function purchase()
  {
      return $this->belongsTo(Purchase::class);
  }
  /**
   * Get the category.
   */
  public function item()
  {
      return $this->belongsTo(Course::class);
  }
}
