<?php

namespace App\Models\Companies;

use Illuminate\Database\Eloquent\Model;
use App\Models\Companies\Company;
use App\Models\Core\Course;
use Illuminate\Database\Eloquent\SoftDeletes;

class CompanyCourse extends Model
{
    use SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];
    protected $table = 'company_courses';

    /**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
		'company_id', 
		'course_id',
		'quantity', 
		'used', 
        'balance', 
        'unit_price', 
        'total_price', 
		'status',
		'remarks',
		'date',
        'type',
		'discount'
	];

    /**
     * Get the country
     */
    public function course()
    {
        return $this->belongsTo(Course::class);
    }
    /**
     * Get the country
     */
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

}
