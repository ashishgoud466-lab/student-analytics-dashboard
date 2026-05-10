# ==========================================
# RANK LIST
# ==========================================
rank_list_query = """

SELECT *

FROM student_analytics_view

ORDER BY SGPA DESC

"""


# ==========================================
# STUDENTS ABOVE CLASS AVERAGE
# ==========================================
students_above_average_query = """

SELECT *
FROM student_analytics_view

WHERE SGPA >

(
    SELECT AVG(SGPA)
    FROM student_analytics_view
)

"""


# ==========================================
# PROGRAMME TOPPERS
# ==========================================
programme_toppers_query = """

SELECT *

FROM student_analytics_view

ORDER BY
    Programme,
    SGPA DESC

"""


# ==========================================
# CONSISTENT STUDENTS
# ==========================================
consistent_students_query = """

SELECT
    Roll_no,
    Student_name,
    Lowest_GP

FROM student_analytics_view

ORDER BY Lowest_GP DESC

"""


# ==========================================
# PERFORMANCE GAP
# ==========================================
performance_gap_query = """

SELECT

    Roll_no,

    Student_name,

    Highest_GP,

    Average_GP,

    Highest_GP - Average_GP AS Performance_Gap

FROM student_analytics_view

ORDER BY Performance_Gap DESC

"""


# ==========================================
# BACKLOG COUNT
# ==========================================
backlog_count_query = """

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

ORDER BY Backlog_Count DESC

"""


# ==========================================
# HARDEST SUBJECTS
# ==========================================
hardest_subjects_query = """

SELECT *
FROM subject_analytics_view

ORDER BY Average_GP ASC

"""


# ==========================================
# EASIEST SUBJECTS
# ==========================================
easiest_subjects_query = """

SELECT *
FROM subject_analytics_view

ORDER BY Average_GP DESC

"""


# ==========================================
# HIGHEST O GRADES
# ==========================================
highest_o_grades_query = """

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

ORDER BY Total_O_Grades DESC

"""


# ==========================================
# SUBJECT TOPPERS
# ==========================================
subject_toppers_query = """

SELECT *
FROM subject_toppers_view

"""