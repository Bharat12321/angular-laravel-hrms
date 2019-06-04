<?php

use Illuminate\Database\Seeder;

class ConfigItemsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        DB::table('organization_units')->delete();
        DB::table('organization_units')->insert([
            [
                'id' => 1,
                'name' => 'General',
                'code' => '1101',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ]
        ]);
        //DB::statement("ALTER SEQUENCE organization_units_id_seq RESTART 100;");

        DB::table('config_items')->delete();
        DB::table('config_items')->insert([
        	[
        		'id' => 1,
	            'name' => 'Department',
	            'description' => 'Department list for the Employees',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
	        ],
        	[
        		'id' => 2,
	            'name' => 'Designation',
	            'description' => 'Designation list for the Employees',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
	        ],
        	[
        		'id' => 4,
	            'name' => 'Vacation Type',
	            'description' => 'Vacation Type list for the Employees',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
	        ],
        	[
        		'id' => 5,
	            'name' => 'Working Status',
	            'description' => 'Employee Working Status',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
	        ],
        	[
        		'id' => 6,
	            'name' => 'ID Type',
	            'description' => 'Employee ID type list',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
	        ],
        	[
        		'id' => 7,
	            'name' => 'Employment Type',
	            'description' => 'Type of the Employment',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
	        ],
        	[
        		'id' => 8,
	            'name' => 'Joining Type',
	            'description' => 'Employee Type of the Joining',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
	        ],
        	[
        		'id' => 9,
	            'name' => 'Document Type',
	            'description' => 'Type of the Documents to upload',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
	        ],
            [
                'id' => 14,
                'name' => 'Payment Mode',
                'description' => 'Payment Mode',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ],
            [
                'id' => 15,
                'name' => 'Item Category',
                'description' => 'Payment Mode',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ],
            [
                'id' => 18,
                'name' => 'Discount',
                'description' => 'Discount',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ],
            [
                'id' => 20,
                'name' => 'Activity Type',
                'description' => 'Activity Type',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ],
            [
                'id' => 21,
                'name' => 'Service Category',
                'description' => 'Service Category',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ],
            [
                'id' => 22,
                'name' => 'Package Category',
                'description' => 'Package Category',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ],
            [
                'id' => 23,
                'name' => 'Shelf',
                'description' => 'Stock Shelf',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ],
            [
                'id' => 24,
                'name' => 'Row',
                'description' => 'Stock Row',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ],
            [
                'id' => 25,
                'name' => 'Col',
                'description' => 'Stock col',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ],
            [
                'id' => 26,
                'name' => 'UOM',
                'description' => 'Unit of Measurement',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ],
            [
                'id' => 27,
                'name' => 'Manufacturar',
                'description' => 'Item Manufacturar',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ],
            [
                'id' => 28,
                'name' => 'ItemCategory',
                'description' => 'Items',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ],
            [
                'id' => 29,
                'name' => 'SaleType',
                'description' => 'saleType',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ],
    	]);
        
        //DB::statement("ALTER SEQUENCE config_items_id_seq RESTART 100;");
        DB::table('configs')->delete();
        DB::table('configs')->insert([
            [
                'id' => 1,
                'config_item_id' => 1,
                'name' => 'General',
                'description' => 'General Department',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ],
            [
                'id' => 2,
                'config_item_id' => 2,
                'name' => 'General',
                'description' => 'General Designation',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ],
            [
                'id' => 4,
                'config_item_id' => 4,
                'name' => 'Annual',
                'description' => 'Anual Vacation',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ],
            [
                'id' => 5,
                'config_item_id' => 5,
                'name' => 'Working',
                'description' => 'Working',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ],
            [
                'id' => 6,
                'config_item_id' => 5,
                'name' => 'Vacation',
                'description' => 'Vacation',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ],
            [
                'id' => 7,
                'config_item_id' => 6,
                'name' => 'Passport',
                'description' => 'Passport',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ],
            [
                'id' => 8,
                'config_item_id' => 6,
                'name' => 'ID',
                'description' => 'ID',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ],
            [
                'id' => 9,
                'config_item_id' => 6,
                'name' => 'License',
                'description' => 'License',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ],
            [
                'id' => 11,
                'config_item_id' => 7,
                'name' => 'Own',
                'description' => 'Own',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ],
            [
                'id' => 12,
                'config_item_id' => 8,
                'name' => 'Fresher',
                'description' => 'Fresher',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ],
            [
                'id' => 13,
                'config_item_id' => 9,
                'name' => 'ID',
                'description' => 'ID',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ],
            [
                'id' => 17,
                'config_item_id' => 14,
                'name' => 'Cash',
                'description' => 'Cash Payment Mode',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ],
            [
                'id' => 18,
                'config_item_id' => 14,
                'name' => 'Cheque',
                'description' => 'Cheque Payment Mode',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ],
            [
                'id' => 30,
                'config_item_id' => 20,
                'name' => 'Late Warning',
                'description' => 'Late Warning',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ],
            [
                'id' => 31,
                'config_item_id' => 21,
                'name' => 'Service1',
                'description' => 'Service1',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ],
            [
                'id' => 32,
                'config_item_id' => 22,
                'name' => 'PackageCat1',
                'description' => 'PackageCat1',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ],
            [
                'id' => 33,
                'config_item_id' => 22,
                'name' => 'PackageCat2',
                'description' => 'PackageCat2',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ],
            [
                'id' => 34,
                'config_item_id' => 23,
                'name' => 'Shelf1',
                'description' => 'Shelf 1',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ],
            [
                'id' => 35,
                'config_item_id' => 23,
                'name' => 'Shelf2',
                'description' => 'Shelf',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ],
            [
                'id' => 36,
                'config_item_id' => 23,
                'name' => 'Shelf2',
                'description' => 'Shelf',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ],
            [
                'id' => 37,
                'config_item_id' => 24,
                'name' => '1',
                'description' => 'Row',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ],
            [
                'id' => 38,
                'config_item_id' => 25,
                'name' => '1',
                'description' => 'Col',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ],
            [
                'id' => 39,
                'config_item_id' => 26,
                'name' => 'Pcs',
                'description' => 'Pcs',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ],
            [
                'id' => 40,
                'config_item_id' => 26,
                'name' => 'Nos',
                'description' => 'Nos',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ],
            [
                'id' => 41,
                'config_item_id' => 27,
                'name' => 'Crocs',
                'description' => 'Item Manufacturar',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ],
            [
                'id' => 42,
                'config_item_id' => 27,
                'name' => 'Google',
                'description' => 'Item Manufacturar',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ],
            [
                'id' => 43,
                'config_item_id' => 28,
                'name' => 'Spa',
                'description' => 'Item category',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ],
            [
                'id' => 44,
                'config_item_id' => 29,
                'name' => 'Service',
                'description' => 'Sale category',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ],
            [
                'id' => 45,
                'config_item_id' => 29,
                'name' => 'Package',
                'description' => 'Sale category',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ],
            [
                'id' => 46,
                'config_item_id' => 29,
                'name' => 'Products',
                'description' => 'Sale category',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ],
        ]);
        //DB::statement("ALTER SEQUENCE configs_id_seq RESTART 100;");
    }
}
