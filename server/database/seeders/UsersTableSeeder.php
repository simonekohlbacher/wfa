<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user1 = new User();
        $user1->name = 'malu';
        $user1->firstname = 'Maria';
        $user1->lastname = 'Lutz';
        $user1->email = 'malu@nh.com';
        $user1->password = bcrypt('secret');
        $user1->telephone = '0664123123';
        $user1->education = 'Master of Science in Computer Engineering mit Schwerpunkt auf Softwareentwicklung und Design im Webbereich';
        $user1->role = 'teacher';
        $user1->avatar = 'https://randomuser.me/api/portraits/women/' . rand(0, 99) . '.jpg';
        $user1->save();

        $user2 = new User();
        $user2->name = 'hamu';
        $user2->firstname = 'Hans';
        $user2->lastname = 'Muster';
        $user2->email = 'hamu@nh.com';
        $user2->password = bcrypt('secret');
        $user2->telephone = '06769876543';
        $user2->education = 'Diplom-Ingenieurin für Online-Marketing mit Schwerpunkt Digitale Medien und Markenkommunikation';
        $user2->role = 'teacher';
        $user2->avatar = 'https://randomuser.me/api/portraits/men/' . rand(0, 99) . '.jpg';
        $user2->save();

        $user3 = new User();
        $user3->name = 'algru';
        $user3->firstname = 'Alice';
        $user3->lastname = 'Gruber';
        $user3->email = 'algru@gmail.com';
        $user3->password = bcrypt('secret');
        $user3->telephone = '0676456765';
        $user3->education = 'Student of Computer Enigneering';
        $user3->role = 'student';
        $user3->save();

        $user4 = new User();
        $user4->name = 'bemu';
        $user4->firstname = 'Bernd';
        $user4->lastname = 'Mueller';
        $user4->email = 'bemu@gmail.com';
        $user4->password = bcrypt('secret');
        $user4->telephone = '06648642457';
        $user4->education = '';
        $user4->role = 'student';
        $user4->save();

    }
}
