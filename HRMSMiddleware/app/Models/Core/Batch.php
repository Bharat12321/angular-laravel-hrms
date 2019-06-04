<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Core\Config;
use App\Models\Core\Course;
use App\Models\Employees\Employee;
use App\Models\Students\StudentBatch;

class Batch extends Model
{
    use SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];
    protected $table = 'batches';

    /**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
		'course_id',
		'code',
		'name',
		'type_id',
		'comp_inv',
		'month',
		'year',
		'date_rage',
		'start_date',
		'end_date',
		'employee_id',
		'remark_id',
		'certificate_date',
		'status'
	];

    /**
     * Get the configItems for the blog post.
     */
    public function type()
    {
        return $this->belongsTo(Config::class);
    }
    /**
     * Get the configItems for the blog post.
     */
    public function course()
    {
        return $this->belongsTo(Course::class);
    }
    /**
     * Get the configItems for the blog post.
     */
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
    /**
     * Get the configItems for the blog post.
     */
    public function remark()
    {
        return $this->belongsTo(Config::class);
    }
    
}
