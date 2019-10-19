<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class postImg extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'file_name', 'post_id', 'img_sequence'
    ];

}
