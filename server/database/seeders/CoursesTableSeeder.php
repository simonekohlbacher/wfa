<?php

namespace Database\seeders;

use App\Models\Course;
use Illuminate\Database\Seeder;

class CoursesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $course = new Course();
        $course->title = 'HTML';
        $course->description = 'In diesem Kurs lernst du die Grundlagen von HTML – der Sprache, die das Gerüst jeder Webseite bildet. Du erfährst, wie man Inhalte strukturiert, Texte, Bilder und Links einbindet und die Basis für modernes Webdesign legt. Perfekt für Einsteiger, die den Grundstein für ihre Webentwicklungskarriere legen wollen.';
        $course->subject_id = 1;
        $course->teacher_id = 1;
        $course->save();

        $course1 = new Course();
        $course1->title = 'Javascript';
        $course1->description = 'In diesem Kurs tauchst du in die Welt von JavaScript ein – der Programmiersprache, die Webseiten lebendig macht. Du lernst, wie man Interaktivität hinzufügt, Formulare validiert, Animationen erstellt und mit APIs kommuniziert. Ideal für alle, die dynamische Webanwendungen entwickeln möchten.';
        $course1->subject_id = 1;
        $course1->teacher_id = 1;
        $course1->save();

        $course2 = new Course();
        $course2->title = 'Sketching';
        $course2->description = 'In diesem Kurs lernst du die Grundlagen des Sketchings als wichtigen Teil des UX/UI-Designs. Du übst, Ideen schnell und effektiv mit Skizzen und Wireframes zu visualisieren, um Benutzeroberflächen und Interaktionskonzepte zu planen. Ideal für alle, die ihre Designprozesse kreativ und strukturiert starten wollen.';
        $course2->subject_id = 2;
        $course2->teacher_id = 1;
        $course2->save();

        $course3 = new Course();
        $course3->title = 'SEO';
        $course3->description = 'Dieser Kurs vermittelt dir die Grundlagen der Suchmaschinenoptimierung (SEO). Du lernst, wie du Webseiten so gestaltest und optimierst, dass sie bei Google & Co. besser gefunden werden. Themen sind Keyword-Recherche, On-Page-Optimierung, technische SEO und Linkbuilding. Perfekt für alle, die ihre Sichtbarkeit im Netz nachhaltig steigern wollen.';
        $course3->subject_id = 3;
        $course3->teacher_id = 2;
        $course3->save();


    }
}
