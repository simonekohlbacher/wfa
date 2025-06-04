<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Appointment extends Model
{
    protected $fillable = ['course_id', 'start_at', 'end_at', 'status', 'price',
    ];

    public function course() : BelongsTo
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    public function registrations() : HasMany
    {
        return $this->hasMany(Registration::class);
    }

    public function getStatus()
    {
        $statusLabels = [
            'available' => 'Verfügbar',
            'enrolled' => 'Angemeldet',
        ];

        return $statusLabels[$this->status] ?? 'Unbekannt';
    }



}
