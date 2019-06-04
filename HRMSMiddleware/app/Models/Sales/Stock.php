<?php

namespace App\Models\Sales;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Employees\Employee;
use App\Models\Sales\PurchaseDetail;
use App\Models\Sales\Item;
use App\Models\Core\OrganizationUnit;

class Stock extends Model
{
    
    use SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];
    protected $table = 'stock';	
    /**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
          
           'item_id','organization_id','quantity','price',
           'status'
	];
 
  /**
   * Get the category.
   */

  public function organization()
  {
      return $this->belongsTo(OrganizationUnit::class);
  }
  public function Item()
  {
      return $this->belongsTo(Item::class);
  }
  /**
   * Get the category.
   */
 
  /**
   * Get the category.
   */

}
