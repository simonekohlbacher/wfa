<?php

namespace App\Http\Controllers;
use App\Models\Appointment;
use App\Models\Course;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class AppointmentController extends Controller
{
    public function index(int $subjectId, int $courseId): JsonResponse
    {
        // wird im nachhilfeservice vom FE aufgerufen
        $appointments = Appointment::with('course')
            // nur termine mit status 'available' und in der Zukunft
            ->where('status', 'available')
            ->where('start_at', '>=', now())
            // dazugehörigen kurs und fach checken, damit eindeutig zuordenbar
            ->whereHas('course', function ($query) use ($subjectId, $courseId) {
                $query->where('id', $courseId)
                    ->whereHas('subject', function ($query) use ($subjectId) {
                        $query->where('id', $subjectId);
                    });
            })->get();
        if ($appointments->isEmpty()) {
            return response()->json(['error' => 'No appointments found for this course'], 404);
        }
        return response()->json($appointments, 200);
    }


    // methode im FE nicht mehr gebraucht da grafisch anders gelöst
    public function show(int $subjectId, string $courseId, int $id): JsonResponse {
        $appointment = Appointment::where('id', $id)
            // course und subject checken
            // mehrstufige abfrage https://www.php.cn/de/faq/1796687447.html
            ->whereHas('course', function ($q) use ($courseId, $subjectId) {
                $q->where('id', $courseId)
                    ->whereHas('subject', function ($q2) use ($subjectId) {
                        $q2->where('id', $subjectId);
                    });
            })->with('course')->first();
        if (!$appointment) {
            return response()->json(['error' => 'Appointment not found'], 404);
        }
        return response()->json($appointment, 200);
    }


    public function save(Request $request): JsonResponse
    {
        // datumsfelder aus request parsen und formatieren
        $request = $this->parseRequest($request);
        if ($request['end_at'] < $request['start_at']) {
            return response()->json('End date cannot be before start date', 400);
        }
        if ($request['start_at'] < now()) {
            return response()->json('Start date cannot be in the past', 400);
        }
        DB::beginTransaction();
        try {
            $appointment = Appointment::create($request->all());
            $course = Course::where('id', $request['course_id'])->first();
            if (!Gate::allows('own-course', $course)) {
                DB::rollBack();
                return response()->json('you are not allowed to save an appointment for this course', 403);
            }
            DB::commit();
            return response()->json($appointment, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json("Saving appointment failed: " . $e->getMessage(), 500);
        }
    }


    public function update(Request $request, int $subjectId, int $courseId, int $id): JsonResponse
    {
        $request = $this->parseRequest($request);
        DB::beginTransaction();
        try {
            $appointment = Appointment::where('id', $id)->first();
            if ($appointment === null) {
                DB::rollBack();
                return response()->json(['error' => 'Appointment not found'], 404);
            }
            // nur termine mit status 'available' können geändert werden
            // wenn user anfragt hat dann kann auch der termin gerade nicht geändert werden
            if ($appointment->status != 'available') {
                DB::rollBack();
                return response()->json(['error' => 'Appointment is not available, someone is enrolled'], 403);
            }
            $course = $appointment->course;
            if (!Gate::allows('own-course', $course)) {
                DB::rollBack();
                return response()->json('You are not allowed to edit the appointment for this course', 403);
            }
            $appointment->update($request->all());
            DB::commit();
            return response()->json($appointment, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json("Updating appointment failed: " . $e->getMessage(), 500);
        }
    }


    public function delete(int $subjectId, int $courseId, string $id): JsonResponse
    {
        $appointment = Appointment::where('id', $id)
            // wählt den termin mit genau dieser ID
            ->whereHas('course', function ($q) use ($courseId, $subjectId) {
                // nur, wenn ein passender course existiert mit id
                $q->where('id', $courseId)
                    // der auch das passende subject hat
                    ->whereHas('subject', function ($q2) use ($subjectId) {
                        $q2->where('id', $subjectId);
                    });
            })->first();
        if ($appointment === null) {
            return response()->json(['error' => 'Appointment not found'], 404);
        }
        $course = $appointment->course;
        if (!Gate::allows('own-course', $course)) {
            return response()->json('You are not allowed to delete the appointment for this course', 403);
        }
        if ($appointment->status != 'available') {
            return response()->json(['error' => 'Appointment is not available, someone is enrolled'], 403);
        }
        $appointment->delete();
        return response()->json(['message' => 'Appointment deleted successfully'], 200);
    }



    private function parseRequest(Request $request): Request {
        // erzeugt aus request start_at und end_at DateTime-Objekte und zeitzone
        $startDate = \DateTime::createFromFormat('Y-m-d H:i:s', $request->start_at, new \DateTimeZone(date_default_timezone_get()));
        $endDate = \DateTime::createFromFormat('Y-m-d H:i:s', $request->end_at, new \DateTimeZone(date_default_timezone_get()));
        // zuweisen und korrektes Format für die DB
        $request['start_at'] = $startDate->format('Y-m-d H:i:s');
        $request['end_at'] = $endDate->format('Y-m-d H:i:s');
        return $request;
    }


}
