<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Model;
use App\Models\Core\Permission;

class Role extends Model
{
	
    protected $table = 'roles';
    
	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
           'name',
           'slug'
	];
	
    public function permissions() {
	   return $this->belongsToMany(Permission::class,'roles_permissions');
	}
}
