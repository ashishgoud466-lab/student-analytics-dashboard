USE Student_appdemo_db;
SELECT

    Roll_no,

    Student_name,

    (
        SELECT COUNT(*)
        FROM Enroll E
        WHERE
            E.Roll_no = S.Roll_no
        AND
            E.Grade_point < 5
    ) AS Backlog_Count

FROM student_analytics_view S

ORDER BY Backlog_Count DESC;