
USE student_appdemo_db;

CREATE VIEW student_analytics_view AS

SELECT

    S.Roll_no,

    S.Student_name,

    S.Branch,

    S.Programme,

    S.Admission_Year,

    ROUND(
        SUM(E.Grade_point * C.Credits)
        / SUM(C.Credits),
        2
    ) AS SGPA,

    ROUND(
        AVG(E.Grade_point),
        2
    ) AS Average_GP,

    MIN(E.Grade_point) AS Lowest_GP,

    MAX(E.Grade_point) AS Highest_GP,

    COUNT(*) AS Total_Subjects

FROM Enroll E

JOIN Courses C
ON E.Cid = C.Cid

JOIN Student_info S
ON E.Roll_no = S.Roll_no

GROUP BY
    S.Roll_no,
    S.Student_name,
    S.Branch,
    S.Programme,
    S.Admission_Year;