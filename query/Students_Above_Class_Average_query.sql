USE Student_appdemo_db;
SELECT *
FROM student_analytics_view

WHERE SGPA > (

    SELECT AVG(SGPA)
    FROM student_analytics_view
);