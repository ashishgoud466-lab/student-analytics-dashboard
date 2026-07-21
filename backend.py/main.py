from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
import os


# =========================================================
# APP
# =========================================================

app = FastAPI(
    title="Student Analytics API",
    version="3.0"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# DATABASE
# =========================================================

def get_connection():
    """
    Connect to Aiven MySQL.

    IMPORTANT:
    DB_PASSWORD is the AIVEN DATABASE PASSWORD.
    It is NOT a student login password.
    """

    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("DB_PORT", "3306")),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        ssl_disabled=False
    )


# =========================================================
# HELPER
# =========================================================

def normalize_roll(roll_no):
    """
    Makes roll-number handling consistent everywhere.
    """

    return str(roll_no or "").strip().upper()


# =========================================================
# HOME / HEALTH CHECK
# =========================================================

@app.get("/")
def home():

    return {
        "success": True,
        "message": "Student Analytics API Running",
        "version": "3.0"
    }


# =========================================================
# LOGIN
#
# PASSWORDLESS LOGIN
#
# Student only needs to exist in student_info.
# Users table is NOT used.
# =========================================================

@app.post("/login")
def login(data: dict = Body(...)):

    conn = None
    cursor = None

    try:

        roll_no = normalize_roll(
            data.get("roll_no")
        )

        if not roll_no:

            return {
                "success": False,
                "message": "Roll number is required"
            }


        conn = get_connection()

        cursor = conn.cursor(
            dictionary=True
        )


        # -------------------------------------------------
        # CHECK STUDENT
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT *
            FROM student_info
            WHERE UPPER(TRIM(Roll_no)) = %s
            LIMIT 1
            """,
            (roll_no,)
        )


        student = cursor.fetchone()


        if not student:

            return {
                "success": False,
                "message": "Invalid roll number"
            }


        # -------------------------------------------------
        # LOGIN SUCCESS
        # -------------------------------------------------

        return {

            "success": True,

            "roll_no":
                student.get(
                    "Roll_no",
                    roll_no
                ),

            "role":
                "student",

            "name":
                student.get(
                    "Student_name",
                    ""
                ),

            "branch":
                student.get(
                    "Branch",
                    ""
                ),

            "programme":
                student.get(
                    "Programme",
                    ""
                ),

            "year":
                student.get(
                    "Current_year",
                    2
                ),

            "sem_id":
                student.get(
                    "Current_sem",
                    2
                ),

            # Users table is no longer required
            "email":
                ""
        }


    except Exception as e:

        print(
            "LOGIN ERROR:",
            str(e)
        )

        return {
            "success": False,
            "message": str(e)
        }


    finally:

        if cursor:

            try:
                cursor.close()

            except Exception:
                pass


        if conn:

            try:

                if conn.is_connected():
                    conn.close()

            except Exception:
                pass


# =========================================================
# SEMESTER DATA
# =========================================================

@app.get("/semester/{sem_id}/{roll_no}")
def semester_data(
    sem_id: int,
    roll_no: str
):

    conn = None
    cursor = None


    try:

        roll_no = normalize_roll(
            roll_no
        )


        # -------------------------------------------------
        # SEMESTER VALIDATION
        # -------------------------------------------------

        if sem_id < 1 or sem_id > 4:

            return {
                "success": False,
                "message": "Invalid semester"
            }


        conn = get_connection()

        cursor = conn.cursor(
            dictionary=True
        )


        # -------------------------------------------------
        # GET COURSES + STUDENT GRADES
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT

                c.Cid,

                c.Course_name,

                c.Credits,

                e.Grade_point

            FROM courses c

            LEFT JOIN enroll e

                ON c.Cid = e.Cid

                AND UPPER(TRIM(e.Roll_no)) = %s

                AND e.is_latest = 1

            WHERE c.Sem_id = %s

            ORDER BY c.Cid
            """,
            (
                roll_no,
                sem_id
            )
        )


        subjects = cursor.fetchall()


        # -------------------------------------------------
        # SGPA
        # -------------------------------------------------

        total_points = 0.0

        total_credits = 0.0


        for subject in subjects:

            credits = float(
                subject.get(
                    "Credits",
                    0
                ) or 0
            )


            grade_point = subject.get(
                "Grade_point"
            )


            # Only count subjects that have a grade

            if (
                grade_point is not None
                and grade_point != ""
            ):

                grade_point = float(
                    grade_point
                )


                total_points += (
                    grade_point
                    *
                    credits
                )


                total_credits += credits


            else:

                # Makes React input clean
                subject["Grade_point"] = ""


        sgpa = 0.00


        if total_credits > 0:

            sgpa = round(
                total_points
                /
                total_credits,
                2
            )


        return {

            "success": True,

            "semester":
                sem_id,

            "subjects":
                subjects,

            "sgpa":
                sgpa
        }


    except Exception as e:

        print(
            "SEMESTER ERROR:",
            str(e)
        )


        return {

            "success": False,

            "message":
                str(e)
        }


    finally:

        if cursor:

            try:
                cursor.close()

            except Exception:
                pass


        if conn:

            try:

                if conn.is_connected():
                    conn.close()

            except Exception:
                pass


# =========================================================
# UPDATE / INSERT GRADE
# =========================================================

@app.post("/update-grade")
def update_grade(
    data: dict = Body(...)
):

    conn = None
    cursor = None


    try:

        # -------------------------------------------------
        # INPUT
        # -------------------------------------------------

        roll_no = normalize_roll(
            data.get("roll_no")
        )


        cid = str(
            data.get("cid") or ""
        ).strip()


        grade_point = data.get(
            "grade_point"
        )


        # -------------------------------------------------
        # VALIDATION
        # -------------------------------------------------

        if not roll_no:

            return {
                "success": False,
                "message": "Roll number is required"
            }


        if not cid:

            return {
                "success": False,
                "message": "Course ID is required"
            }


        if grade_point is None:

            return {
                "success": False,
                "message": "Grade point is required"
            }


        try:

            grade_point = float(
                grade_point
            )


        except (
            ValueError,
            TypeError
        ):

            return {

                "success": False,

                "message":
                    "Grade point must be a number"
            }


        if (
            grade_point < 0
            or
            grade_point > 10
        ):

            return {

                "success": False,

                "message":
                    "Grade point must be between 0 and 10"
            }


        # -------------------------------------------------
        # DATABASE
        # -------------------------------------------------

        conn = get_connection()


        cursor = conn.cursor(
            dictionary=True
        )


        # -------------------------------------------------
        # VERIFY STUDENT
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT Roll_no

            FROM student_info

            WHERE UPPER(TRIM(Roll_no)) = %s

            LIMIT 1
            """,
            (roll_no,)
        )


        student = cursor.fetchone()


        if not student:

            return {

                "success": False,

                "message":
                    "Student not found"
            }


        # -------------------------------------------------
        # VERIFY COURSE
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT Cid

            FROM courses

            WHERE Cid = %s

            LIMIT 1
            """,
            (cid,)
        )


        course = cursor.fetchone()


        if not course:

            return {

                "success": False,

                "message":
                    "Course not found"
            }


        # -------------------------------------------------
        # CHECK EXISTING ENROLLMENT
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT *

            FROM enroll

            WHERE UPPER(TRIM(Roll_no)) = %s

            AND Cid = %s

            AND is_latest = 1

            LIMIT 1
            """,
            (
                roll_no,
                cid
            )
        )


        existing = cursor.fetchone()


        # -------------------------------------------------
        # UPDATE
        # -------------------------------------------------

        if existing:

            cursor.execute(
                """
                UPDATE enroll

                SET Grade_point = %s

                WHERE UPPER(TRIM(Roll_no)) = %s

                AND Cid = %s

                AND is_latest = 1
                """,
                (
                    grade_point,
                    roll_no,
                    cid
                )
            )


        # -------------------------------------------------
        # INSERT
        # -------------------------------------------------

        else:

            cursor.execute(
                """
                INSERT INTO enroll
                (
                    Roll_no,
                    Cid,
                    Grade_point,
                    is_latest
                )

                VALUES
                (
                    %s,
                    %s,
                    %s,
                    1
                )
                """,
                (
                    roll_no,
                    cid,
                    grade_point
                )
            )


        conn.commit()


        return {

            "success": True,

            "message":
                "Grade saved successfully",

            "roll_no":
                roll_no,

            "cid":
                cid,

            "grade_point":
                grade_point
        }


    except Exception as e:


        if conn:

            try:
                conn.rollback()

            except Exception:
                pass


        print(
            "UPDATE GRADE ERROR:",
            str(e)
        )


        return {

            "success": False,

            "message":
                str(e)
        }


    finally:

        if cursor:

            try:
                cursor.close()

            except Exception:
                pass


        if conn:

            try:

                if conn.is_connected():
                    conn.close()

            except Exception:
                pass


# =========================================================
# ANALYTICS
# =========================================================

@app.get("/analytics/{roll_no}")
def analytics(
    roll_no: str
):

    conn = None
    cursor = None


    try:

        roll_no = normalize_roll(
            roll_no
        )


        conn = get_connection()


        cursor = conn.cursor(
            dictionary=True
        )


        # -------------------------------------------------
        # SGPA PER SEMESTER
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT

                c.Sem_id,

                ROUND(

                    SUM(

                        CASE

                            WHEN e.Grade_point IS NOT NULL

                            THEN
                                e.Grade_point
                                *
                                c.Credits

                            ELSE 0

                        END

                    )

                    /

                    NULLIF(

                        SUM(

                            CASE

                                WHEN e.Grade_point IS NOT NULL

                                THEN c.Credits

                                ELSE 0

                            END

                        ),

                        0
                    ),

                    2

                ) AS SGPA

            FROM courses c


            LEFT JOIN enroll e

                ON c.Cid = e.Cid

                AND UPPER(TRIM(e.Roll_no)) = %s

                AND e.is_latest = 1


            WHERE c.Sem_id BETWEEN 1 AND 4


            GROUP BY c.Sem_id


            ORDER BY c.Sem_id
            """,
            (roll_no,)
        )


        analytics_data = (
            cursor.fetchall()
        )


        # Replace NULL SGPA with 0

        for semester in analytics_data:

            if semester.get("SGPA") is None:

                semester["SGPA"] = 0


        return {

            "success": True,

            "analytics":
                analytics_data
        }


    except Exception as e:

        print(
            "ANALYTICS ERROR:",
            str(e)
        )


        return {

            "success": False,

            "message":
                str(e)
        }


    finally:

        if cursor:

            try:
                cursor.close()

            except Exception:
                pass


        if conn:

            try:

                if conn.is_connected():
                    conn.close()

            except Exception:
                pass


# =========================================================
# STUDENT PROFILE
# =========================================================

@app.get("/student/{roll_no}")
def student_profile(
    roll_no: str
):

    conn = None
    cursor = None


    try:

        roll_no = normalize_roll(
            roll_no
        )


        conn = get_connection()


        cursor = conn.cursor(
            dictionary=True
        )


        cursor.execute(
            """
            SELECT *

            FROM student_info

            WHERE UPPER(TRIM(Roll_no)) = %s

            LIMIT 1
            """,
            (roll_no,)
        )


        student = cursor.fetchone()


        if not student:

            return {

                "success": False,

                "message":
                    "Student not found"
            }


        return {

            "success": True,

            "student":
                student
        }


    except Exception as e:

        print(
            "STUDENT PROFILE ERROR:",
            str(e)
        )


        return {

            "success": False,

            "message":
                str(e)
        }


    finally:

        if cursor:

            try:
                cursor.close()

            except Exception:
                pass


        if conn:

            try:

                if conn.is_connected():
                    conn.close()

            except Exception:
                pass