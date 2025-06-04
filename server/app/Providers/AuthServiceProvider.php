<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;
use App\Models\Subject;
use App\Models\Registration;
use App\Models\Course;
use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        //
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        Gate::define('own-subject', function (User $user, Subject $subject)
        {
            return $user->id == $subject->teacher_id;
        });
        Gate::define('own-course', function (User $user, Course $course)
        {
            return $user->id == $course->teacher_id;
        });
        Gate::define('own-registration', function (User $user, Registration $registration)
        {
            return $user->id == $registration->student_id;
        });

    }
}
