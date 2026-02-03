<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Role::insert([
            ['roleName'=>'admin',"created_at"=>now(),"updated_at"=>now()],
            ['roleName'=>'commercial',"created_at"=>now(),"updated_at"=>now()],
            ['roleName'=>'atelier',"created_at"=>now(),"updated_at"=>now()],
            ['roleName'=>'comptable',"created_at"=>now(),"updated_at"=>now()],
        ]);
    }
}
