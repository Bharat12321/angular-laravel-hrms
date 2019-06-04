<?php

namespace App\Models\Accounts;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    
    protected $table = 'invoices';


    protected $fillable = [
           'taggable_id',
           'taggable_type',
           'address',
           'fees',
           'date',
           'due_date',
           'type',
           'total',
           'paid',
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
}
