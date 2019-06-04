<?php

namespace App\Models\Sales;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Employees\Employee;
use App\Models\Sales\PurchaseDetail;
use App\Models\Core\Config;
use App\Models\Core\OrganizationUnit;

class Gin extends Model
{
    use SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];
    protected $table = 'gin';	
    /**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
           'organization_id','grnno','pono','date',    
           'remarks',
           'status'
	];

  /**
   * Get the category.
   */

  public function organizationunit()
  {
      return $this->belongsTo(OrganizationUnit::class);
  }
  /**
   * Get the category.
   */
 
  /**
   * Get the category.
   */

}
