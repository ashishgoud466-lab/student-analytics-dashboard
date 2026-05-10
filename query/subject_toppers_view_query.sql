USE student_appdemo_db;
CREATE VIEW subject_toppers_view AS

SELECT

    C.Course_name,

    E.Roll_no,

    S.Student_name,

    E.Grade_point

FROM Enroll E

JOIN Courses C
ON E.Cid = C.Cid

JOIN Student_info S
ON E.Roll_no = S.Roll_no

WHERE (E.Cid, E.Grade_point) IN (

    SELECT
        Cid,
        MAX(Grade_point)

    FROM Enroll

    GROUP BY Cid
);