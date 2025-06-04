<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Registration extends Model
{
    protected $fillable = ['student_id', 'appointment_id', 'comment', 'status'];

    protected $appends = ['status_label'];

    public function appointment() : BelongsTo
    {
        return $this->belongsTo(Appointment::class);
    }

    public function student() : BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getStatusLabelAttribute()
    {
        $statusLabels = [
            'requested' => 'Angefragt',
            'accepted' => 'Akzeptiert',
            'denied' => 'Abgelehnt',
            'completed' => 'Abgeschlossen',
            'missed' => 'Versäumt',
        ];

        return $statusLabels[$this->status] ?? 'Unbekannt';
    }

}
