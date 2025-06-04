<?php

namespace Database\Seeders;

use App\Models\Subject;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SubjectsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $subject = new Subject();
        $subject->title = 'Web-Entwicklung';
        $subject->description = 'In diesem Fach gibt es Kurse zu moderner Webentwicklung – von HTML und CSS bis hin zu JavaScript und responsiven Layouts. Ideal für Einsteiger:innen, die verstehen wollen, wie Webseiten wirklich funktionieren.';
        $subject->teacher_id = 1;
        $subject->save();

        $subject1 = new Subject();
        $subject1->title = 'UX-UI';
        $subject1->description = 'In diesem Kurs findest du Kurse zum user-zentrierten Design und responsiven Layouts. Ideal für Einsteiger:innen, die nachhaltiges und moderne Webdesign zaubern wollen.';
        $subject1->teacher_id = 1;
        $subject1->save();

        $subject2 = new Subject();
        $subject2->title = 'Online-Marketing';
        $subject2->description = 'Dieses Fach bietet Kurse für einen praxisorientierten Einstieg in die Welt des Online-Marketings. Du lernst die Grundlagen von SEO, Social Media Marketing, Content-Strategie, E-Mail-Marketing und bezahlter Werbung (z.B. Google Ads). Ideal für alle, die verstehen wollen, wie digitale Sichtbarkeit entsteht und wie man Zielgruppen effektiv erreicht.';
        $subject2->teacher_id = 2;
        $subject2->save();

        $subject3 = new Subject();
        $subject3->title = 'Performance-Marketing';
        $subject3->description = 'In diesem weiterführenden Fach gibt es Kurse zum Vertiefen des Wissens im Bereich Online-Marketing. Du lernst fortgeschrittene Techniken zur Conversion-Optimierung, A/B-Testing, Performance-Marketing (z.B. Facebook Ads, Google Ads), Retargeting und Marketing Automation. Außerdem entwickelst du datenbasierte Kampagnenstrategien und wertest KPIs gezielt aus, um deine Marketingmaßnahmen nachhaltig zu optimieren.';
        $subject3->teacher_id = 2;
        $subject3->save();
    }
}
