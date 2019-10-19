<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class favoriteLists extends Model
{
    protected $fillable = [
        'user_id','post_id',
    ];
}
