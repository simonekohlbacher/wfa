<?php

namespace App\Http\Controllers;
use App\Models\Course;
use App\Models\Subject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class SubjectController extends Controller
{

    public function index(): JsonResponse
    {
        // aktuell eingeloggter User aus token welcher mitgeschickt wird
        // auth() ist ein helper, der den aktuellen user zurückgibt = Auth::guard(), in config/auth.php
        $user = auth()->user();
        // conditional query - wenn kein user da ist oder der user kein teacher alle subject, bei teacher nur die eigenen
        $subjects = Subject::when($user && $user->role === 'teacher', function ($query) use ($user) {
            return $query->where('teacher_id', $user->id);
        })->get();
        // gefilterte (oder ungefilterte) ergebnisse
        return response()->json($subjects, 200);
    }


    public function show(int $subjectId): JsonResponse
    {
        $subject = Subject::where('id', $subjectId)->with('teacher')->with('courses')->first();
        if (!$subject) {
            return response()->json(['error' => 'Subject not found'], 404);
        }
        return response()->json($subject, 200);
    }


    public function save (Request $request) : JsonResponse {
        DB::beginTransaction();
        try {
            $data = $request->all();
            $subject = Subject::create($request->all());
            // kurse anlegen, wenn sie im request sind
            if (!empty($data['courses']) && is_array($data['courses'])) {
                foreach ($data['courses'] as $c) {
                    $course = new Course();
                    $course->title = $c['title'];
                    $course->description = $c['description'];
                    $course->subject_id = $subject->id;
                    $course->teacher_id = $subject->teacher_id;
                    $subject->courses()->save($course);
                }
            }
            DB::commit();
            return response()->json($subject, 202);
        }
        catch (\Exception $e) {
            DB::rollBack();
            return response()->json("Saving subject failed: " . $e->getMessage(), 500);
        }
    }


    public function update(Request $request, int $subjectId): JsonResponse
    {
        DB::beginTransaction();
        try {
            $subject = Subject::where('id', $subjectId)->first();
            if (!$subject) {
                DB::rollBack();
                return response()->json(['error' => 'Subject not found'], 404);
            }
            if (!Gate::allows('own-subject', $subject)) {
                DB::rollBack();
                return response()->json('You are not allowed to edit this subject', 403);
            }
            // nur die Felder title und description aktualisieren, da nur diese bearbeitet werden können
            $subject->update($request->only(['title', 'description']));

            // Kurse aktualisieren oder neu erstellen
            if (isset($request['courses']) && is_array($request['courses'])) {
                $keepCourseIds = [];
                foreach ($request['courses'] as $courseData) {
                    if (isset($courseData['id'])) {
                        // update von bestehenden kursen
                        $course = Course::where('id', $courseData['id'])
                            ->where('subject_id', $subject->id)
                            ->first();
                        // wenn bestehenden kurs gefunden
                        if ($course) {
                            $course->update($courseData);
                            // und zu bestehenden kursen hinzufügen
                            $keepCourseIds[] = $course->id;
                        }
                    } else {
                        // neuen kurs erstellen
                        $course = new Course($courseData);
                        $course->teacher_id = $subject->teacher_id;
                        $subject->courses()->save($course);
                        // und zu bestehenden kursen hinzufügen
                        $keepCourseIds[] = $course->id;
                    }
                }
            }
            DB::commit();
            return response()->json($subject->load('courses'), 202);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json("Updating subject failed: " . $e->getMessage(), 500);
        }
    }


    public function delete(int $subjectId) : JsonResponse {
        $subject = Subject::where('id', $subjectId)->first();
        if ($subject) {
            if(!Gate::allows('own-subject', $subject)) {
                return response()->json('you are not allowed to delete this subject', 401);
            }
            $subject->delete();
            return response()->json('subject (' . $subjectId . ') successfully deleted', 200);
        }
        else
            return response()->json('subject could not be deleted - it does not exist', 404);
    }


    // alle kurse eines subjects anzeigen
    public function courses(int $subjectId) : JsonResponse
    {
        $subject = Subject::where('id', $subjectId)->first();
        if (!$subject) {
            return response()->json(['error' => 'Subject not found'], 404);
        }
        $courses = Course::where('subject_id', $subject->id)->get();
        return response()->json($courses, 200);
    }


}


