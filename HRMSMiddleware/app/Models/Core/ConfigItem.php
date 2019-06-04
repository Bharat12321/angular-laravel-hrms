<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Model;
use App\Models\Core\Config;

class ConfigItem extends Model
{
    protected $table = 'config_items';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
	      'name', 'description','status', 
	];

	/**
     * Get the configs for the blog post.
     */
    public function configs()
    {
        return $this->hasMany(Config::class);
    }
}
