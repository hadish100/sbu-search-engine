const fs = require('fs').promises;
const axios = require('axios');
const FormData = require('form-data');


async function main()
{

    try 
    {
        await fs.access('courses.json');
    }

    catch (error) 
    {
        await fs.writeFile('courses.json', '{}');
    }

    const data = await fs.readFile('index.html', 'utf8');
    var students = data.match(/const students = \s*\[([\s\S]*?)\]/)[1];
    students = "[" + students + "]";
    students = students.replace(/(\d)\"\,/g,"$1\"");
    students = JSON.parse(students);
    students = students.map(s=>s.student_id);

    for(var i=0;i<students.length;i++)
    {
        const form_data = new FormData();
        const username = students[i];
        form_data.append('username', username);
        var course_request = await axios.post("https://vu.sbu.ac.ir/class/course.list.php", form_data);
        var courses = course_request.data.match(/<li  class="list-group-item" >([\s\S]*?)<\/li>/g);
        courses = courses.map(c=>c.replace(/<a.*?>(.*?)<\/a>/g, "$1"));
        courses = courses.map(c=>c.replace(/<\/?li.*?>/g, ""));
        courses = courses.map(c=>c.replace(/\(.*?\)/g, ""));
        courses = courses.map(c=>c.replace(/\n/g, ""));
        courses = courses.map(c=>c.replace(/\r/g, ""));
        courses = courses.map(c=>c.replace(/\t/g, ""));
        courses = courses.map(c=>c.replace(/ي/g, "ی"));
        courses = courses.map(c=>c.replace(/ك/g, "ک"));
        var persian_numbers = ["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"];
        var english_numbers = ["0","1","2","3","4","5","6","7","8","9"];
        courses = courses.map(c=>c.split("").map(l=>english_numbers.includes(l)?persian_numbers[english_numbers.indexOf(l)]:l).join(""));
        courses = courses.map(c=>c.trim());

        var courses_json = await fs.readFile('courses.json', 'utf8');
        courses_json = JSON.parse(courses_json);
        courses_json[username] = courses;
        await fs.writeFile('courses.json', JSON.stringify(courses_json, null, 0));

        console.log(`(${i}) courses for student ${username} fetched and saved.`);
    }
}

main();