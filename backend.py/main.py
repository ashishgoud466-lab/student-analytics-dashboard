from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI


from db import cursor

import queries

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# HOME
# ==========================================
@app.get("/")
def home():

    return {
        "message": "Student Analytics API Running"
    }


# ==========================================
# RANK LIST
# ==========================================
@app.get("/ranklist")
def get_ranklist():

    return {
        "total_students": 1,
        "results": [
            {
                "Roll_no": "24011M2104",
                "Student_name": "Shyam",
                "Programme": "Computer Science",
                "SGPA": 8.17
            }
        ]
    }
@app.get("/student/{roll}")

def get_student(roll: str):

    # =========================
    # STUDENT ANALYTICS
    # =========================

    cursor.execute(f"""

        SELECT *

        FROM student_analytics_view

        WHERE Roll_no = '{roll}'

    """)

    student = cursor.fetchone()


    # =========================
    # SUBJECTS
    # =========================

    cursor.execute(f"""

        SELECT

            C.Cid,

            C.Course_name,

            C.Credits,

            E.Grade_point

        FROM Enroll E

        JOIN Courses C
        ON E.Cid = C.Cid

        WHERE E.Roll_no = '{roll}'

    """)

    subjects = cursor.fetchall()


    return {

        "student": student,

        "subjects": subjects

    }
# ==========================================
# ABOVE CLASS AVERAGE
# ==========================================
@app.get("/above-class-average")
def above_average():

    cursor.execute(
        queries.students_above_average_query
    )

    return cursor.fetchall()
@app.get("/compare/{roll1}/{roll2}")

def compare_students(roll1: str, roll2: str):

    cursor.execute(f"""

        SELECT *

        FROM student_analytics_view

        WHERE Roll_no = '{roll1}'

    """)

    student1 = cursor.fetchone()


    cursor.execute(f"""

        SELECT *

        FROM student_analytics_view

        WHERE Roll_no = '{roll2}'

    """)

    student2 = cursor.fetchone()


    return {

        "student1": student1,

        "student2": student2

    }


# ==========================================
# PROGRAMME TOPPERS
# ==========================================
@app.get("/programme-toppers")
def programme_toppers():

    cursor.execute(
        queries.programme_toppers_query
    )

    return cursor.fetchall()


# ==========================================
# CONSISTENT STUDENTS
# ==========================================
@app.get("/consistent-students")
def consistent_students():

    cursor.execute(
        queries.consistent_students_query
    )

    return cursor.fetchall()


# ==========================================
# PERFORMANCE GAP
# ==========================================
@app.get("/performance-gap")
def performance_gap():

    cursor.execute(
        queries.performance_gap_query
    )

    return cursor.fetchall()


# ==========================================
# BACKLOGS
# ==========================================
@app.get("/backlogs")
def backlogs():

    cursor.execute(
        queries.backlog_count_query
    )

    return cursor.fetchall()


# ==========================================
# HARDEST SUBJECTS
# ==========================================
@app.get("/hardest-subjects")
def hardest_subjects():

    cursor.execute(
        queries.hardest_subjects_query
    )

    return cursor.fetchall()


# ==========================================
# EASIEST SUBJECTS
# ==========================================
@app.get("/easiest-subjects")
def easiest_subjects():

    cursor.execute(
        queries.easiest_subjects_query
    )

    return cursor.fetchall()


# ==========================================
# HIGHEST O GRADES
# ==========================================
@app.get("/highest-o-grades")
def highest_o_grades():

    cursor.execute(
        queries.highest_o_grades_query
    )

    return cursor.fetchall()


# ==========================================
# SUBJECT TOPPERS
# ==========================================
@app.get("/subject-toppers")
def subject_toppers():

    cursor.execute(
        queries.subject_toppers_query
    )

    return cursor.fetchall()

@app.get("/compare/{s1}/{s2}")
def compare(s1: str, s2: str):

    query = '''

    SELECT

        C.Course_name,

        E1.Grade_point AS Student1_GP,

        E2.Grade_point AS Student2_GP

    FROM Enroll E1

    JOIN Enroll E2
    ON E1.Cid = E2.Cid

    JOIN Courses C
    ON E1.Cid = C.Cid

    WHERE
        E1.Roll_no = %s
    AND
        E2.Roll_no = %s

    '''

    cursor.execute(query, (s1, s2))

    return cursor.fetchall()

@app.get("/search/{name}", tags=["Search"])
def search_student(name: str):

    query = '''

    SELECT *
    FROM student_analytics_view
    WHERE Student_name LIKE %s

    '''

    cursor.execute(query, (f"%{name}%",))

    data = cursor.fetchall()

    return data

@app.get("/health")
def health():

    return {
        "status": "running"
    }

# ==========================================
# SINGLE STUDENT
# ==========================================
@app.get("/student/{roll_no}", tags=["Students"])
def student(roll_no: str):

    query = '''

    SELECT *
    FROM student_analytics_view
    WHERE Roll_no = %s

    '''

    cursor.execute(query, (roll_no,))

    data = cursor.fetchone()

    if not data:
        return {
            "error": "Student not found"
        }

    return data
