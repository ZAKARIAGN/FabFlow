<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    protected $fillable = [
        "type",
        "number",
        "status",
        "client_id",
        "parent_id",
        "totale"
    ];





    public function client()
    {
        return $this->belongsTo(Client::class);
    }


    public function parent()
    {
        return $this->belongsTo(Document::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Document::class, 'parent_id');
    }


    public function items(){
        return $this->hasMany(Document_item::class);
    }
}
