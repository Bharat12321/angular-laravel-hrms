<?php

namespace App\Models\Sales;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Employees\Employee;
use App\Models\Sales\PurchaseDetail;
use App\Models\Companies\Company;
use App\Models\Core\Config;
use App\Models\Core\OrganizationUnit;

class Grn extends Model
{
    
    use SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];
    protected $table = 'grn';	
    /**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
           'company_id',
           'organization_id','grnno','pono','date',    
           'remarks',
           'status'
	];

  /**
   * Get the category.
   */
  public function company()
  {
      return $this->belongsTo(Company::class);
  }
  public function organizationunit()
  {
      return $this->belongsTo(OrganizationUnit::class);
  }
  public function Uom()
  {
      return $this->belongsTo(Config::class);
  }
  /**
   * Get the category.
   */
 
  /**
   * Get the category.
   */

}
