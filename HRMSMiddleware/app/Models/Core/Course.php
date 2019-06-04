<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Core\Config;

class Course extends Model
{
    use SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];
    protected $table = 'courses';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
           'name',
           'category_id',
           'duration',
           'original_price',
           'discount_price',
           'remarks',
           'status'
	];

    /**
     * Get the configItems for the blog post.
     */
    public function category()
    {
        return $this->belongsTo(Config::class);
    }
}
