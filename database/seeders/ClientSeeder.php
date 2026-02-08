<?php

namespace Database\Seeders;

use App\Models\Client;
use DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         DB::table('clients')->insert([
            [
                "company_name" => "Zakaria SARL",
                "address" => "Tit Mellil",
                "email" => "zakaria@test.com",
                "tel" => "0649961829",
                "vat_number" => "147258"
            ],
            [
                "company_name" => "Atlas Industries",
                "address" => "Casablanca",
                "email" => "atlas@test.com",
                "tel" => "0654127890",
                "vat_number" => "258369"
            ],
            [
                "company_name" => "Sahara Trading",
                "address" => "Marrakech",
                "email" => "sahara@test.com",
                "tel" => "0665231478",
                "vat_number" => "369147"
            ],
            [
                "company_name" => "Rif Solutions",
                "address" => "Tangier",
                "email" => "rif@test.com",
                "tel" => "0678541236",
                "vat_number" => "741852"
            ],
            [
                "company_name" => "Casbah Technologies",
                "address" => "Fès",
                "email" => "casbah@test.com",
                "tel" => "0647852369",
                "vat_number" => "852963"
            ],
        ]);
    }
}
