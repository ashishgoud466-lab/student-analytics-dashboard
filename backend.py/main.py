from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
from mysql.connector import Error

app = FastAPI()

# ---------------- CORS ---------------- #

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- DATABASE ---------------- #


import os


def get_connection():

    return mysql.connector.connect(

        host=os.getenv("DB_HOST"),

        port=int(os.getenv("DB_PORT")),

        user=os.getenv("DB_USER"),

        password=os.getenv("DB_PASSWORD"),

        database=os.getenv("DB_NAME"),

        ssl_disabled=False
    )

# ---------------- HOME ---------------- #

@app.get("/")
def home():

    return {
        "message": "Student Analytics API Running"
    }

# ---------------- LOGIN ---------------- #

@app.post("/login")
def login(data: dict = Body(...)):

    try:

        conn = get_connection()

        cursor = conn.cursor(dictionary=True)

        roll = data.get("roll_no")
        password = data.get("password")

        cursor.execute("""

            SELECT *

            FROM Users

            WHERE Roll_no = %s

            AND
            (
                Password = %s

                OR

                Temp_Password = %s
            )

        """, (

            roll,
            password,
            password

        ))

        user = cursor.fetchone()

        if not user:

            return {

                "success": False,

                "message": "Invalid credentials"
            }

        # -------- STUDENT INFO -------- #

        cursor.execute("""

            SELECT *

            FROM student_info

            WHERE Roll_no = %s

        """, (roll,))

        student = cursor.fetchone()

        conn.close()

        return {

            "success": True,

            "roll_no": user.get("Roll_no", ""),

            "role": user.get("Role", "student"),

            "first_login": user.get("First_Login", 0),

            "name": student.get("Student_name", ""),

            "branch": student.get("Branch", ""),

            "programme": student.get("Programme", ""),

            "year": 1,

            "sem_id": 1,

            "email": user.get("Email", "")
        }

    except Exception as e:

        return {

            "success": False,

            "message": str(e)
        }

# ---------------- SEMESTER DATA ---------------- #

@app.get("/semester/{sem_id}/{roll_no}")
def semester_data(sem_id: int, roll_no: str):

    try:

        conn = get_connection()

        cursor = conn.cursor(dictionary=True)

        cursor.execute("""

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

        """, (

            roll_no,
            sem_id

        ))

        subjects = cursor.fetchall()

        total_points = 0
        total_credits = 0

        for s in subjects:

            if s["Grade_point"] is None:

                s["Grade_point"] = ""

            gp = s["Grade_point"] or 0
            cr = float(s["Credits"] or 0)

            total_points += gp * cr
            total_credits += cr

        sgpa = 0

        if total_credits > 0:

            sgpa = round(
                total_points / total_credits,
                2
            )

        conn.close()

        return {

            "success": True,

            "subjects": subjects,

            "sgpa": sgpa
        }

    except Exception as e:

        return {

            "success": False,

            "message": str(e)
        }


# ---------------- ANALYTICS ---------------- #

@app.get("/analytics/{roll_no}")
def analytics(roll_no: str):

    try:

        conn = get_connection()

        cursor = conn.cursor(dictionary=True)

        cursor.execute("""

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

                    SUM(
                        c.Credits
                    ),

                    2

                ) AS SGPA

            FROM courses c

            LEFT JOIN enroll e

            ON c.Cid = e.Cid

            AND e.Roll_no = %s

            GROUP BY c.Sem_id

            ORDER BY c.Sem_id

        """, (

            roll_no,

        ))

        data = cursor.fetchall()

        conn.close()

        return {

            "success": True,

            "analytics": data

        }

    except Exception as e:

        return {

            "success": False,

            "message": str(e)

        }

# ---------------- STUDENT PROFILE ---------------- #

@app.get("/student/{roll_no}")
def student_profile(roll_no: str):

    try:

        conn = get_connection()

        cursor = conn.cursor(dictionary=True)

        cursor.execute("""

            SELECT *

            FROM student_info

            WHERE Roll_no = %s

        """, (roll_no,))

        student = cursor.fetchone()

        conn.close()

        if not student:

            return {

                "success": False,

                "message": "Student not found"
            }

        return {

            "success": True,

            "student": student
        }

    except Exception as e:

        return {

            "success": False,

            "message": str(e)
        }