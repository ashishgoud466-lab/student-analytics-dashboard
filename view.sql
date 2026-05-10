CREATE DATABASE student_appdemo_db;
CREATE VIEW student_analytics_view AS

SELECT

    s.Roll_no,
    s.Student_name,
    s.Programme,

    ROUND(AVG(e.Grade_point), 2) AS SGPA

FROM Student_info s

JOIN Enroll e
ON s.Roll_no = e.Roll_no

GROUP BY s.Roll_no, s.Student_name, s.Programme;