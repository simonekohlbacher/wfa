<?php

namespace App\Http\Controllers;


use App\Models\Registration;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RegistrationController extends Controller
{

    public function index(): JsonResponse
    {
        // immer nur die registrierungen des eingeloggten users
        $user = auth()->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        // kurs dazuladen um effizienter darauf zugreifen zu können
        $query = Registration::with(['appointment.course']);
        if ($user->role === 'student') {
            $query->where('student_id', $user->id);
        } elseif ($user->role === 'teacher') {
            $query->whereHas('appointment.course', function ($q) use ($user) {
                $q->where('teacher_id', $user->id);
            });
        }
        // jetzt die db frage wirklich ausführen mit den gefilterten daten
        $registrations = $query->get();
        return response()->json($registrations);
    }


    public function show(int $id): JsonResponse {
        $registration = Registration::with(['appointment.course.teacher', 'student', 'appointment.course.subject'])->where('id', $id)->first();
        if ($registration === null) {
            return response()->json(['error' => 'Registration not found'], 404);
        }
        return response()->json($registration, 200);
    }


    public function save(Request $request) : JsonResponse {
        DB::beginTransaction();
        try {
            $userId = auth()->id();
            $appointmentId = $request->input('appointment_id');
            // prüfen ob user bereits für genau diesen termin registriert ist
            $existing = Registration::where('student_id', $userId)
                ->where('appointment_id', $appointmentId)
                ->first();
            if ($existing) {
                return response()->json(['error' => 'Du bist für diesen Termin bereits registriert.'], 400);
            }
            $registration = Registration::create($request->all());
            $appointment = $registration->appointment;
            $appointment->status = 'enrolled';
            $appointment->save();
            DB::commit();
            return response()->json($registration, 201);
        }
        catch (\Exception $e) {
            DB::rollBack();
            return response()->json("Saving registration failed: " . $e->getMessage(), 500);
        }
    }


    public function update(Request $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            $registration = Registration::where('id', $request->id)->first();
            $registration->update($request->all());
            $appointment = $registration->appointment;
            if ($appointment) {
                // wenn der status der registrierung geändert wurde den status des appointments anpassen
                if (in_array($registration->status, ['accepted', 'requested', 'completed', 'missed'])) {
                    $appointment->status = 'enrolled';
                } elseif ($registration->status === 'denied') {
                    $appointment->status = 'available';
                }
                $appointment->save();
            }
            DB::commit();
            return response()->json($registration, 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json("Updating registration failed: " . $e->getMessage(), 500);
        }
    }


    // Methoden nicht im Einsatz, da eig nicht gelöscht werden soll, sondern nur der Status geändert wird
    public function delete(int $id): JsonResponse
    {
        $registration = Registration::where('id', $id)->first();
        if ($registration === null) {
            return response()->json(['error' => 'Registration not found'], 404);
        }
        if($registration->status != 'requested') {
            return response()->json(['error' => 'Registration cannot be deleted, is already accepted or over'], 403);
        }
        // appointment status auf available setzen
        $appointment = $registration->appointment;
        if ($appointment && $appointment->status === 'enrolled') {
            $appointment->status = 'available';
            $appointment->save();
        }
        $registration->delete();
        return response()->json(['message' => 'Registration deleted'], 200);
    }


}
