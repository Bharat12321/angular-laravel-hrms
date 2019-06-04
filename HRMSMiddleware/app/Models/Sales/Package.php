<?php

namespace App\Models\Sales;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Core\Config;


class Package extends Model
{
    
    use SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];
    protected $table = 'packages';	
    /**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
           'name',
           'package_category_id',
           'description',
           'price',
           'sessions',
           'status'
	];

  /**
   * Get the category.
   */
  public function package_category()
  {
      return $this->belongsTo(Config::class);
  }
}
