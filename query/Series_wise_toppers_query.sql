USE Student_appdemo_db;
SELECT *

FROM student_analytics_view

ORDER BY

    CASE

        WHEN Roll_no LIKE '%MB5%'
        THEN 1

        WHEN Roll_no LIKE '%M22%'
        THEN 2

        WHEN Roll_no LIKE '%M21%'
        THEN 3

        ELSE 4

    END,

    SGPA DESC;
