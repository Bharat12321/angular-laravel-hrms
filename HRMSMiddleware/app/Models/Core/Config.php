<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Model;
use App\Models\Core\ConfigItem;
use Illuminate\Database\Eloquent\SoftDeletes;

class Config extends Model
{
    use SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];
    protected $table = 'configs';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
	      'name', 'description','status', 'sort' , 'config_item_id'
	];

	/**
     * Get the configItems for the blog post.
     */
    public function configItem()
    {
        return $this->belongsTo(ConfigItem::class);
    }
}
