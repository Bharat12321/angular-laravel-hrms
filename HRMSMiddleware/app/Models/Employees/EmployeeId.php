<?php

namespace App\Models\Employees;

use Illuminate\Database\Eloquent\Model;
use App\Models\Employees\Employee;
use App\Models\Core\Config;
use Illuminate\Database\Eloquent\SoftDeletes;

class EmployeeId extends Model
{
    use SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];
    
    protected $table = 'employee_ids';

     /**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
           'taggable_id',
           'taggable_type',
	      'type_id', 
	      'number', 
	      'expiry_date', 
          'location', 
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
     * Get the type
     */
    public function type()
    {
        return $this->belongsTo(Config::class);
    }
}
