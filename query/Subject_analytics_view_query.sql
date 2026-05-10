USE student_appdemo_db;
CREATE VIEW subject_analytics_view AS

SELECT

    C.Cid,

    C.Course_name,

    C.Credits,

    ROUND(
        AVG(E.Grade_point),
        2
    ) AS Average_GP,

    MAX(E.Grade_point) AS Highest_GP,

    MIN(E.Grade_point) AS Lowest_GP,

    COUNT(*) AS Total_Students,

    SUM(
        CASE
            WHEN E.Grade_point < 5
            THEN 1
            ELSE 0
        END
    ) AS Backlogs

FROM Enroll E

JOIN Courses C
ON E.Cid = C.Cid

GROUP BY
    C.Cid,
    C.Course_name,
    C.Credits;