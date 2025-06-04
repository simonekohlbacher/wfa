<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;


class Subject extends Model
{
    // define all properties that should be writable
    protected $fillable = ['title', 'description', 'teacher_id'];

    // course belongs to one teacher
    public function teacher() : BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // course has many lessons
    public function courses() : HasMany
    {
        return $this->hasMany(Course::class);
    }


}
