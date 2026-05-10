USE Student_appdemo_db;
SELECT

    Roll_no,

    Student_name,

    Highest_GP,

    Average_GP,

    Highest_GP - Average_GP AS Performance_Gap

FROM student_analytics_view

ORDER BY Performance_Gap DESC;