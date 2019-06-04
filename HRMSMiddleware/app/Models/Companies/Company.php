<?php

namespace App\Models\Companies;

use Illuminate\Database\Eloquent\Model;
use App\Models\Core\Config;
use App\Models\Core\Country;
use App\Models\Core\Profile;
use App\Models\Accounts\Payment;
use App\Models\Employees\Employee;
use App\Models\Employees\EmployeeId;
use App\Models\Payrolls\EmployeeActivity;
use App\Models\Students\Student;
use App\User;
use Illuminate\Database\Eloquent\SoftDeletes;

class Company extends Model
{
    use SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];
    protected $table = 'companies';

    /**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
		'name', 
		'code',
		'type', 
		'address', 
        'reference', 
		'city',
		'pin_code',
		'country_id',
		'owner_id',
		'person',
		'email',
		'phone',
		'remarks',
		'website', 
		'status'
	];

    /**
     * Get the contracts
     */
    public function students()
    {
        return $this->hasMany(Students::class);
    }


    /**
     * Get all of the profiles's comments.
     */
    public function ids()
    {
        return $this->morphMany(EmployeeId::class, 'taggable');
    }

    /**
     * Get all of the profiles's comments.
     */
    public function activities()
    {
        return $this->morphMany(EmployeeActivity::class, 'taggable');
    }

    /**
     * Get the country
     */
    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    /**
     * Get all of the post's comments.
     */
    public function payments()
    {
        return $this->morphMany(Payment::class, 'taggable');
    }

    /**
     * Get all of the profiles's comments.
     */
    public function profiles()
    {
        return $this->morphMany(Profile::class, 'taggable');
    }

    /**
     * Get all of the profiles's comments.
     */
    public function users()
    {
        return $this->morphMany(User::class, 'taggable');
    }

    /**
     * Get the country
     */
    public function owner()
    {
        return $this->belongsTo(Employee::class);
    }

}
