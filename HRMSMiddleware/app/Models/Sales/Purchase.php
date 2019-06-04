<?php

namespace App\Models\Sales;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Employees\Employee;
use App\Models\Sales\PurchaseDetail;
use App\Models\Companies\Company;
use App\Models\Core\Config;

class Purchase extends Model
{
    
    use SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];
    protected $table = 'purchase';	
    /**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
           'company_id',
           'organization_id','pono','date','name','discount','total','sub_total','vat',     
           'paid_amount',
           'due_amount',
           'payment_type','payment_mode','chequeno','chqdate','remarks',
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
  /**
   * Get the category.
   */
 
  /**
   * Get the category.
   */
  public function details()
  {
      return $this->hasMany(PurchaseDetail::class);
  }
  public function paymenttype()
  {
      return $this->belongsTo(Config::class);
  }
}
