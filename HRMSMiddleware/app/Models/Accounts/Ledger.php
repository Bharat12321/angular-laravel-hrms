<?php

namespace App\Models\Accounts;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Accounts\Payment;

class Ledger extends Model
{
    use SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];
    protected $table = 'ledgers';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
          'name', 'remarks','address','status'
	];

    /**
     * Get all of the post's comments.
     */
    public function payments()
    {
        return $this->morphMany(Payment::class, 'taggable');
    }
}
