<?php

namespace Database\Seeders;

use App\Models\User;
use Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::insert([
            ["first_name" => "admin", "last_name" => "admin", "email" => "admin@gmail.com", "password" => Hash::make("admin123"), "role_id" => 1, "created_at" => now(), "updated_at" => now()]
        ]);
    }
}
