USE student_appdemo_db;
SET @rank = 0;

SELECT

    (@rank := @rank + 1) AS Rank_No,

    Roll_no,

    Student_name,

    Programme,

    SGPA,

    Average_GP

FROM student_analytics_view

ORDER BY SGPA DESC;