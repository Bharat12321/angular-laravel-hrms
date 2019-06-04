<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Model;
use App\Models\Core\Country;
use App\Models\Devices\Device;
use App\Models\Employees\Employee;
use App\Models\Students\Student;
use Illuminate\Database\Eloquent\SoftDeletes;
class OrganizationUnit extends Model
{
    use SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];
    protected $table = 'organization_units';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
	      'name', 'code','company_name', 'country_id' , 'city', 'address','pin_code','status','remarks'
	];

	/**
     * Get the country.
     */
    public function country()
    {
        return $this->belongsTo(Country::class);
    }

 	/**
     * The organizations that belong to the devices.
     */
    public function devices()
    {
        return $this->belongsToMany(Device::class,'device_organizations');
    }

    /**
     * Get the employees
     */
    public function employees()
    {
        return $this->hasMany(Employee::class, 'organization_id');
    }
    /**
     * Get the students
     */
    public function students()
    {
        return $this->hasMany(Student::class, 'organization_id');
    }
}
