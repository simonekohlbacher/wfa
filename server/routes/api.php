<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\CourseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// kein JWT Token nötig
Route::post('auth/login', [AuthController::class,'login']);
Route::get('subjects', [SubjectController::class,'index']);
Route::get('subjects/{subjectId}', [SubjectController::class,'show']);
Route::get('subjects/{subjectId}/courses', [SubjectController::class, 'courses']);
Route::get('subjects/{subjectId}/courses/{courseId}', [CourseController::class, 'show']);
Route::get('subjects/{subjectId}/courses/{courseId}/appointments', [AppointmentController::class, 'index']);
Route::get('subjects/{subjectId}/courses/{courseId}/appointments/{appointmentId}', [AppointmentController::class, 'show']);

// nur mit JWT Token = angemeldet
Route::group(['middleware' => ['api','auth.jwt']], function(){
    Route::post('auth/logout', [AuthController::class,'logout']);
    Route::get('registrations', [RegistrationController::class, 'index']);
    Route::get('registrations/{registrationId}', [RegistrationController::class, 'show']);
    Route::delete('registrations/{registrationId}', [RegistrationController::class, 'delete']); // im FE nicht umgesetzt
});

// nur teacher
Route::group(['middleware' => ['api','auth.jwt', 'auth.teacher']], function(){
    Route::post('subjects', [SubjectController::class,'save']);
    Route::put('subjects/{subjectId}', [SubjectController::class, 'update']);
    Route::delete('subjects/{subjectId}', [SubjectController::class, 'delete']);
    Route::post('subjects/{subjectId}/courses', [CourseController::class, 'save']);
    Route::put('subjects/{subjectId}/courses/{courseId}', [CourseController::class, 'update']); // im FE nicht umgesetzt, da bei Subject dabei
    Route::delete('subjects/{subjectId}/courses/{courseId}', [CourseController::class, 'delete']);
    Route::post('subjects/{subjectId}/courses/{courseId}/appointments', [AppointmentController::class, 'save']);
    Route::put('subjects/{subjectId}/courses/{courseId}/appointments/{appointmentId}', [AppointmentController::class, 'update']);
    Route::delete('subjects/{subjectId}/courses/{courseId}/appointments/{appointmentId}', [AppointmentController::class, 'delete']);
    Route::put('registrations/{registrationId}', [RegistrationController::class, 'update']);
});

// nur student
Route::group(['middleware' => ['api','auth.jwt', 'auth.student']], function(){
    Route::post('registrations', [RegistrationController::class, 'save']);
});









