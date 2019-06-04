<?php

namespace App\Models\Employees;

use Illuminate\Database\Eloquent\Model;
use App\Models\Core\Config;
use App\Models\Core\OrganizationUnit;
use App\Models\Core\Country;
use App\Models\Core\Profile;
use App\Models\Core\Sponsor;
use App\Models\Core\Bank;
use App\Models\Companies\Company;
use App\Models\Accounts\Payment;
use App\Models\Employees\EmployeeContract;
use App\Models\Employees\EmployeeDetail;
use App\Models\Employees\EmployeeFamily;
use App\Models\Employees\EmployeeId;
use App\Models\Payrolls\EmployeeSalary;
use App\Models\Payrolls\EmployeeCertificate;
use App\Models\Payrolls\EmployeeActivity;
use App\Models\Attendances\Shift;
use App\Models\Students\Student;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\User;

class Employee extends Model
{
    use SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];
    protected $table = 'employees';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
        'code', 
        'name', 
        'arabic_name', 
        'date_of_birth', 
        'email', 
        'contact_number', 
        'country_id',
        'joining_date', 
        'joining_type_id', 
        'type_id', 
        'organization_id', 
        'class_id', 
        'department_id', 
        'designation_id', 
        'category_id' ,
        'sponsor_id',
        'bank_id',
        'account_number',
        'iban',
        'gender' ,
        'grade_id',
        'working_status_id',
        'payroll_center_id',
        'status',
        'remarks'
	];


	/**
     * Get the contracts
     */
    public function detail()
    {
        return $this->hasOne(EmployeeDetail::class);
    }   
    /**
     * Get the contracts
     */
    public function class()
    {
        return $this->belongsTo(Config::class);
    }

	/**
     * Get the contracts
     */
    public function contracts()
    {
        return $this->hasMany(EmployeeContract::class);
    }

    /**
     * Get the contracts
     */
    public function students()
    {
        return $this->hasMany(Students::class);
    }
    /**
     * Get the contracts
     */
    public function certificates()
    {
        return $this->hasMany(EmployeeCertificate::class);
    }

	/**
     * Get the contracts
     */
    public function families()
    {
        return $this->hasMany(EmployeeFamily::class);
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
     * Get the contracts
     */
    public function salaries()
    {
        return $this->hasMany(EmployeeSalary::class);
    }
    /**
     * Get the contracts
     */
    public function companies()
    {
        return $this->hasMany(Company::class);
    }



	/**
     * Get the joining_type.
     */
    public function joining_type()
    {
        return $this->belongsTo(Config::class);
    }

	/**
     * Get the type.
     */
    public function type()
    {
        return $this->belongsTo(Config::class);
    }

	/**
     * Get the organization.
     */
    public function organization()
    {
        return $this->belongsTo(OrganizationUnit::class);
    }
	/**
     * Get the department.
     */
    public function department()
    {
        return $this->belongsTo(Config::class);
    }
    /**
     * Get the sponsor.
     */
    public function sponsor()
    {
        return $this->belongsTo(Sponsor::class);
    }
    /**
     * Get the bank.
     */
    public function bank()
    {
        return $this->belongsTo(Bank::class);
    }

	/**
     * Get the designation.
     */
    public function designation()
    {
        return $this->belongsTo(Config::class);
    }
	/**
     * Get the category.
     */
    public function category()
    {
        return $this->belongsTo(Config::class);
    }

	/**
     * Get the grade.
     */
    public function grade()
    {
        return $this->belongsTo(Config::class);
    }
	/**
     * Get the working_status.
     */
    public function working_status()
    {
        return $this->belongsTo(Config::class);
    }

	/**
     * Get the payrol_center.
     */
    public function payrol_center()
    {
        return $this->belongsTo(Config::class);
    }
    /**
     * Get the country
     */
    public function country()
    {
        return $this->belongsTo(Country::class);
    }


    public function shifts() {
        return $this->belongsToMany(Shift::class,'employee_shifts');
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


}
