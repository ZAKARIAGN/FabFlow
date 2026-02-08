<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produit extends Model
{
    protected $fillable = [
        "label",
        "type",
        "prix",
        "unite",
        "stock"
    ];




    public function documentItems(){
        return $this->hasMany(Document_item::class);
    }
}
