<?php

use Illuminate\Database\Seeder;
use App\Models\Core\Role;
use App\Models\Core\Permission;
use App\User;

class UserRolesPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        
        // create new permissions 
        DB::table('permissions')->delete();

        //core permissions

        Permission::create(['name' => 'View Role','slug' => 'view-Role']);
        Permission::create(['name' => 'Create Role','slug' => 'create-Role']);
        Permission::create(['name' => 'Update Role','slug' => 'update-Role']);

        Permission::create(['name' => 'View User','slug' => 'view-User']);
        Permission::create(['name' => 'Create User','slug' => 'create-User']);
        Permission::create(['name' => 'Update User','slug' => 'update-User']);

        Permission::create(['name' => 'View Setting','slug' => 'view-Setting']);
        Permission::create(['name' => 'Create Setting','slug' => 'create-Setting']);
        Permission::create(['name' => 'Update Setting','slug' => 'update-Setting']);

        Permission::create(['name' => 'View Sponsor','slug' => 'view-Sponsor']);
        Permission::create(['name' => 'Create Sponsor','slug' => 'create-Sponsor']);
        Permission::create(['name' => 'Update Sponsor','slug' => 'update-Sponsor']);
        
        Permission::create(['name' => 'View Bank','slug' => 'view-Bank']);
        Permission::create(['name' => 'Create Bank','slug' => 'create-Bank']);
        Permission::create(['name' => 'Update Bank','slug' => 'update-Bank']);
        
        Permission::create(['name' => 'View Project','slug' => 'view-Project']);
        Permission::create(['name' => 'Create Project','slug' => 'create-Project']);
        Permission::create(['name' => 'Update Project','slug' => 'update-Project']);

        // Device Permissions

        //Employee Permissions

        Permission::create(['name' => 'View Employee','slug' => 'view-Employee']);
        Permission::create(['name' => 'Create Employee','slug' => 'create-Employee']);
        Permission::create(['name' => 'Update Employee','slug' => 'update-Employee']);

        //Accounts permissions

        Permission::create(['name' => 'View Due','slug' => 'view-Due']);
        Permission::create(['name' => 'Create Due','slug' => 'create-Due']);
        Permission::create(['name' => 'Update Due','slug' => 'update-Due']);

        Permission::create(['name' => 'View Payement Category','slug' => 'view-Payement Category']);
        Permission::create(['name' => 'Create Payement Category','slug' => 'create-Payement Category']);
        Permission::create(['name' => 'Update Payement Category','slug' => 'update-Payement Category']);

        Permission::create(['name' => 'View Ledger','slug' => 'view-Ledger']);
        Permission::create(['name' => 'Create Ledger','slug' => 'create-Ledger']);
        Permission::create(['name' => 'Update Ledger','slug' => 'update-Ledger']);

        Permission::create(['name' => 'View Payment','slug' => 'view-Payment']);
        Permission::create(['name' => 'Create Payment','slug' => 'create-Payment']);
        Permission::create(['name' => 'Update Payment','slug' => 'update-Payment']);

        Permission::create(['name' => 'View Item','slug' => 'view-Item']);
        Permission::create(['name' => 'Create Item','slug' => 'create-Item']);
        Permission::create(['name' => 'Update Item','slug' => 'update-Item']);
        
        //create admin role
        DB::table('roles')->delete();

        $admin_role = new Role();
        $admin_role->slug = 'admin';
        $admin_role->name = 'Admin';
        $admin_role->save();
        //get all permissions in the system and assign it to admin role
        $permissions = DB::table('permissions')->get();

        $permissions = collect($permissions)->pluck('id'); 
        $admin_role->permissions()->attach($permissions);

        DB::table('users')->delete();

        $admin = new User();
        $admin->name = 'Admin';
        $admin->username = 'admin';
        $admin->password = '123456';
        $admin->save();
        $admin->roles()->attach($admin_role);
    }
}
