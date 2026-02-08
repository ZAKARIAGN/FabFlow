<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Document_item extends Model
{
    protected $fillable = [
        "qtte",
        "unit_price",
        "tax_rate",
        "produit_id",
        "document_id"
    ];




    public function document(){
        return $this->belongsTo(Document_item::class);
    }


    public function produit(){
        return $this->belongsTo(Produit::class);
    }
}
