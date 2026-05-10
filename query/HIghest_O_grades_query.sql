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
            E.Grade_point = 10
    ) AS Total_O_Grades

FROM student_analytics_view S

ORDER BY Total_O_Grades DESC;