<!DOCTYPE html>
<html>
<head><title></title></head>
<body>
<ul>
    @foreach ($courses as $course)
        <li><a href="/courses/{{$course->id}}">
                {{$course->name}}</a></li>
    @endforeach
</ul>
</body>
</html>
