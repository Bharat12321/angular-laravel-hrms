<?php

namespace App\Models\Companies;

use Illuminate\Database\Eloquent\Model;
use App\Models\Companies\Company;
use Illuminate\Database\Eloquent\SoftDeletes;

class CompanyLpoItem extends Model
{
    use SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];
    protected $table = 'company_lop_items';

    /**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
		'company_id', 
		'name',
		'quantity', 
		'used', 
        'balance', 
        'unit_price', 
        'total_price', 
		'status',
		'remarks',
		'date',
		'discount'
	];

    /**
     * Get the country
     */
    public function course()
    {
        return $this->belongsTo(Course::class);
    }

}
