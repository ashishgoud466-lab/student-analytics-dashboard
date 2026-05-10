USE Student_appdemo_db;
SELECT
    Roll_no,
    Student_name,
    Lowest_GP

FROM student_analytics_view

ORDER BY Lowest_GP DESC;