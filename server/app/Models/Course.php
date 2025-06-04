<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    protected $fillable = ['title', 'description', 'subject_id', 'teacher_id',];

    public function subject() : BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function teacher() : BelongsTo
    {
        return $this->belongsTo(User::class);
    }


    public function appointments() : HasMany
    {
        return $this->hasMany(Appointment::class);
    }


}
