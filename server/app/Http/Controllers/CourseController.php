<?php

namespace App\Http\Controllers;
use App\Models\Appointment;
use App\Models\Course;
use App\Models\Subject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class CourseController extends Controller
{
    
    public function index() : JsonResponse{
        $courses = Course::all();
        return response()->json($courses, 200);
    }

    public function show(int $subjectId, int $courseId): JsonResponse {
        $course = Course::where('id', $courseId)
            // prüft, ob der kurs zu einem subject mit genau dieser ID gehört
            ->where('subject_id', $subjectId)
            // appointments dazu aber nur welche status 'available' haben und in der Zukunft liegen
            ->with(['appointments' => function ($query) {$query->where('status', 'available')->where('start_at', '>', now());}, 'subject'])->first();
        if (!$course) {
            return response()->json(['error' => 'Course not found'], 404);
        }
        return response()->json($course, 200);
    }
    

    public function save(Request $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            $data = $request->all();
            $subject = Subject::where('id', $request->input('subject_id'))->first();
            if (!$subject) {
                return response()->json("Subject for course not found", 404);
            }
            if (!Gate::allows('own-subject', $subject)) {
                DB::rollBack();
                return response()->json('You are not allowed to save a course to the selected subject', 403);
            }
            $course = Course::create($data);
            // appointments auch dazu anlegen, im FE dann nicht mehr umgesetzt in formular
            if (!empty($data['appointments']) && is_array($data['appointments'])) {
                foreach ($data['appointments'] as $app) {
                    $parsed = $this->parseRequest($app);
                    $appointment = new Appointment([
                        'start_at' => $parsed['start_at'],
                        'end_at' => $parsed['end_at'],
                    ]);
                    $course->appointments()->save($appointment);
                }
            }
            DB::commit();
            return response()->json($course, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json("Saving course failed: " . $e->getMessage(), 500);
        }
    }


    public function update(Request $request, int $subjectId, int $courseId) : JsonResponse
    {
        DB::beginTransaction();
        try {
            $course = Course::where('id', $courseId)->first();
            if (!$course) {
                DB::rollBack();
                return response()->json(['error' => 'Course not found'], 404);
            }
            if(!Gate::allows('own-course', $course)) {
                DB::rollBack();
                return response()->json('you are not allowed to edit this course', 403);
            }
            $course->update($request->all());
            DB::commit();
            return response()->json($course, 201);
        }
        catch (\Exception $e) {
            DB::rollBack();
            return response()->json("updating course failed: " . $e->getMessage(), 500);
        }
    }


    public function delete(int $subjectId, int $courseId) : JsonResponse {
        $course = Course::where('id', $courseId)->first();
        if ($course) {
            if(!Gate::allows('own-course', $course)) {
                return response()->json('you are not allowed to delete this course', 403);
            }
            $course->delete();
            return response()->json('course (' . $courseId . ') successfully deleted', 200);
        }
        else
            return response()->json('course could not be deleted - it does not exist', 404);
    }

    
    // funktion hier im FE nicht mehr nötig, da appointments nicht gleichzeitig mit kurs erstellt werden
    private function parseRequest(Request $request): Request {
        //  liest zwei Datumsfelder aus und wandelt diese in datetime obj um mit zeitzone des Servers
        $startDate = \DateTime::createFromFormat('Y-m-d H:i:s', $request->start_at, new \DateTimeZone(date_default_timezone_get()));
        $endDate = \DateTime::createFromFormat('Y-m-d H:i:s', $request->end_at, new \DateTimeZone(date_default_timezone_get()));
        // korrekte zeitzone
        $request['start_at'] = $startDate->format('Y-m-d H:i:s');
        $request['end_at'] = $endDate->format('Y-m-d H:i:s');
        return $request;
    }



}
