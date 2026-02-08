<?php

namespace Database\Seeders;

use DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProduitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table("produits")->insert([
               [
                "label" => "Clé à molette",
                "type" => "fabriqué",
                "prix" => 150.50,
                "unite" => "pièce",
                "stock" => 100
            ],
            [
                "label" => "Service de maintenance",
                "type" => "service",
                "prix" => 500.00,
                "unite" => "forfait",
                "stock" => 0
            ],
            [
                "label" => "Vis M4",
                "type" => "fabriqué",
                "prix" => 0.50,
                "unite" => "pièce",
                "stock" => 1000
            ],
            [
                "label" => "Assemblage",
                "type" => "opération",
                "prix" => 20.00,
                "unite" => "heure",
                "stock" => 0
            ],
            [
                "label" => "Peinture industrielle",
                "type" => "fabriqué",
                "prix" => 300.00,
                "unite" => "forfait",
                "stock" => 50
            ]
        ]);
    }
}
