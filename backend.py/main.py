from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
import os


# =========================================================
# FASTAPI APP
# =========================================================

app = FastAPI(
    title="Student Analytics API",
    version="2.0"
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
# DATABASE CONNECTION
# =========================================================

def get_connection():

    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("DB_PORT", "3306")),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        ssl_disabled=False
    )


# =========================================================
# HOME / HEALTH CHECK
# =========================================================

@app.get("/")
def home():

    return {
        "success": True,
        "message": "Student Analytics API Running"
    }


# =========================================================
# LOGIN
# PASSWORDLESS STUDENT LOGIN
# =========================================================

@app.post("/login")
def login(data: dict = Body(...)):

    conn = None
    cursor = None

    try:

        roll = data.get("roll_no")

        # ---------------------------------------------
        # VALIDATE ROLL NUMBER
        # ---------------------------------------------

        if not roll:

            return {
                "success": False,
                "message": "Roll number is required"
            }

        roll = str(roll).strip().upper()

        # ---------------------------------------------
        # DATABASE
        # ---------------------------------------------

        conn = get_connection()

        cursor = conn.cursor(
            dictionary=True
        )

        # ---------------------------------------------
        # CHECK USER
        # ---------------------------------------------

        cursor.execute(
            """
            SELECT
                Roll_no,
                Role,
                Email
            FROM Users
            WHERE Roll_no = %s
            """,
            (roll,)
        )

        user = cursor.fetchone()

        if not user:

            return {
                "success": False,
                "message": "Invalid roll number"
            }

        # ---------------------------------------------
        # STUDENT INFORMATION
        # ---------------------------------------------

        cursor.execute(
            """
            SELECT *
            FROM student_info
            WHERE Roll_no = %s
            """,
            (roll,)
        )

        student = cursor.fetchone()

        if not student:

            return {
                "success": False,
                "message": "Student information not found"
            }

        # ---------------------------------------------
        # SUCCESS
        # ---------------------------------------------

        return {

            "success": True,

            "roll_no":
                user.get("Roll_no", ""),

            "role":
                user.get("Role", "student"),

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

            # Current app is Year 2
            "year": 2,

            "sem_id":
                student.get(
                    "Current_sem",
                    2
                ),

            "email":
                user.get(
                    "Email",
                    ""
                )
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
# GET SEMESTER DATA
# =========================================================

@app.get(
    "/semester/{sem_id}/{roll_no}"
)
def semester_data(
    sem_id: int,
    roll_no: str
):

    conn = None
    cursor = None

    try:

        roll_no = (
            roll_no
            .strip()
            .upper()
        )

        # ---------------------------------------------
        # VALID SEMESTER
        # ---------------------------------------------

        if sem_id < 1 or sem_id > 4:

            return {
                "success": False,
                "message": "Invalid semester"
            }

        conn = get_connection()

        cursor = conn.cursor(
            dictionary=True
        )

        # ---------------------------------------------
        # SUBJECTS + STUDENT GRADES
        # ---------------------------------------------

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

                AND e.Roll_no = %s

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

        # ---------------------------------------------
        # CALCULATE SGPA
        # ---------------------------------------------

        total_points = 0.0
        total_credits = 0.0

        for subject in subjects:

            credits = float(
                subject.get(
                    "Credits",
                    0
                ) or 0
            )

            grade_point = (
                subject.get(
                    "Grade_point"
                )
            )

            # Only calculate entered grades
            if (
                grade_point is not None
                and grade_point != ""
            ):

                grade_point = float(
                    grade_point
                )

                total_points += (
                    grade_point
                    * credits
                )

                total_credits += credits

            # React input should receive ""
            # when grade hasn't been entered
            if grade_point is None:

                subject[
                    "Grade_point"
                ] = ""

        sgpa = 0.00

        if total_credits > 0:

            sgpa = round(
                total_points
                / total_credits,
                2
            )

        return {

            "success": True,

            "semester": sem_id,

            "subjects": subjects,

            "sgpa": sgpa
        }

    except Exception as e:

        print(
            "SEMESTER ERROR:",
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
# UPDATE / SAVE GRADE
# =========================================================

@app.post("/update-grade")
def update_grade(
    data: dict = Body(...)
):

    conn = None
    cursor = None

    try:

        roll_no = data.get(
            "roll_no"
        )

        cid = data.get(
            "cid"
        )

        grade_point = data.get(
            "grade_point"
        )

        # ---------------------------------------------
        # VALIDATION
        # ---------------------------------------------

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

        roll_no = (
            str(roll_no)
            .strip()
            .upper()
        )

        cid = (
            str(cid)
            .strip()
        )

        try:

            grade_point = float(
                grade_point
            )

        except (ValueError, TypeError):

            return {
                "success": False,
                "message":
                    "Grade point must be a number"
            }

        if (
            grade_point < 0
            or grade_point > 10
        ):

            return {
                "success": False,
                "message":
                    "Grade point must be between 0 and 10"
            }

        # ---------------------------------------------
        # DATABASE
        # ---------------------------------------------

        conn = get_connection()

        cursor = conn.cursor(
            dictionary=True
        )

        # ---------------------------------------------
        # CHECK STUDENT
        # ---------------------------------------------

        cursor.execute(
            """
            SELECT Roll_no
            FROM student_info
            WHERE Roll_no = %s
            """,
            (roll_no,)
        )

        student = cursor.fetchone()

        if not student:

            return {
                "success": False,
                "message": "Student not found"
            }

        # ---------------------------------------------
        # CHECK COURSE
        # ---------------------------------------------

        cursor.execute(
            """
            SELECT Cid
            FROM courses
            WHERE Cid = %s
            """,
            (cid,)
        )

        course = cursor.fetchone()

        if not course:

            return {
                "success": False,
                "message": "Course not found"
            }

        # ---------------------------------------------
        # CHECK EXISTING ENROLLMENT
        # ---------------------------------------------

        cursor.execute(
            """
            SELECT *
            FROM enroll
            WHERE Roll_no = %s
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

        # ---------------------------------------------
        # UPDATE EXISTING GRADE
        # ---------------------------------------------

        if existing:

            cursor.execute(
                """
                UPDATE enroll

                SET Grade_point = %s

                WHERE Roll_no = %s

                AND Cid = %s

                AND is_latest = 1
                """,
                (
                    grade_point,
                    roll_no,
                    cid
                )
            )

        # ---------------------------------------------
        # CREATE NEW ENROLLMENT
        # ---------------------------------------------

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
                "Grade updated successfully",

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
# ANALYTICS
# =========================================================

@app.get(
    "/analytics/{roll_no}"
)
def analytics(
    roll_no: str
):

    conn = None
    cursor = None

    try:

        roll_no = (
            roll_no
            .strip()
            .upper()
        )

        conn = get_connection()

        cursor = conn.cursor(
            dictionary=True
        )

        cursor.execute(
            """
            SELECT

                c.Sem_id,

                ROUND(

                    SUM(

                        IFNULL(
                            e.Grade_point,
                            0
                        )

                        *

                        c.Credits

                    )

                    /

                    NULLIF(
                        SUM(
                            c.Credits
                        ),
                        0
                    ),

                    2

                ) AS SGPA

            FROM courses c

            LEFT JOIN enroll e

                ON c.Cid = e.Cid

                AND e.Roll_no = %s

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

@app.get(
    "/student/{roll_no}"
)
def student_profile(
    roll_no: str
):

    conn = None
    cursor = None

    try:

        roll_no = (
            roll_no
            .strip()
            .upper()
        )

        conn = get_connection()

        cursor = conn.cursor(
            dictionary=True
        )

        cursor.execute(
            """
            SELECT *
            FROM student_info
            WHERE Roll_no = %s
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