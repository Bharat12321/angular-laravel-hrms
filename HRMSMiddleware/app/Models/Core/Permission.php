<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Model;
use App\Models\Core\Role;

class Permission extends Model
{


    protected $table = 'permissions';
    
    public function roles() {
	   return $this->belongsToMany(Role::class,'roles_permissions');
	}
}
