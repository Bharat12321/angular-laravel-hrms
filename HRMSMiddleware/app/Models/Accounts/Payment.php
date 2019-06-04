<?php

namespace App\Models\Accounts;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\Relation;
use App\Models\Accounts\Ledger;
use App\Models\Accounts\PaymentCategory;
use App\Models\Students\Student;
use App\Models\Employees\Employee;
use App\Models\Core\Config;

class Payment extends Model
{
    use SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];
    protected $table = 'payments';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
           'category_id',
           'taggable_id',
           'taggable_type',
           'amount_payable',
           'amount_paid',
           'type_id',
           'reference',
           'payment_date',
           'paid_date',
           'mode_id',
           'remarks',
           'status'
	];


  /**
   * Get all of the owning taggable models.
   */
  public function taggable()
  {
      return $this->morphTo();
  }

  /**
   * Get the category.
   */
  public function category()
  {
      return $this->belongsTo(PaymentCategory::class);
  }
  
  /**
   * Get the category.
   */
  public function mode()
  {
      return $this->belongsTo(Config::class);
  }
}
