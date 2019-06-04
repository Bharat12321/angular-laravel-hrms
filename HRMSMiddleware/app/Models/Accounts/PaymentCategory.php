<?php

namespace App\Models\Accounts;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Accounts\Payment;

class PaymentCategory extends Model
{
    
    use SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];
    protected $table = 'payment_categories';
    /**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
	       'name',
	       'class',
	       'status'
	];	
	/**
     * Get the configs for the blog post.
     */
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
