<?php

namespace App\Models\Sales;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Employees\Employee;
use App\Models\Sales\SaleDetail;
use App\Models\Sales\Items;
use App\Models\Companies\Company;

class Sale extends Model
{
    
    use SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];
    protected $table = 'sales';	
    /**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
           'company_id',
           'organization_id',
           'name',
           'discount',
           'total',
           'sub_total',
           'paid_amount',
           'due_amount',
           'payment_type_id',
           'date',
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
  /**
   * Get the category.
   */
  
  /**
   * Get the category.
   */
  public function details()
  {
      return $this->hasMany(SaleDetail::class);
  }
  public function organizationunit()
  {
      return $this->belongsTo(OrganizationUnit::class);
  }

  public function item()
  {
      return $this->belongsTo(Items::class);
  }
 
  public function payment_type()
  {
      return $this->belongsTo(Config::class);
  }
  public function employee()
  {
      return $this->belongsTo(Employees::class);
  }
}
