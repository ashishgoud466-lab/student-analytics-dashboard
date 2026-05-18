from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Body
from db import get_connection
import queries

app = FastAPI()

# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# HEALTH
# ==========================================

@app.get("/health")
def health():

    return {
        "status": "running"
    }

# ==========================================
# ADMIN RESET PASSWORD
# ==========================================

@app.post("/admin-reset-password")
def admin_reset_password(
    data: dict = Body(...)
):

    conn = get_connection()

    cursor = conn.cursor(dictionary=True)

    roll = data["roll_no"]

    temp_password = data["temp_password"]

    cursor.execute("""

        UPDATE Users

        SET

            Temp_Password = %s,

            Password = NULL

        WHERE Roll_no = %s

    """, (

        temp_password,
        roll

    ))

    conn.commit()

    conn.close()

    return {
        "success": True
    }

# ==========================================
# SEMESTER SUBJECTS
# ==========================================

@app.get("/semester/{sem}/{roll}")
def get_semester_subjects(
    sem: int,
    roll: str
):

    conn = get_connection()

    cursor = conn.cursor(dictionary=True)

    cursor.execute("""

        SELECT

            C.Cid,
            C.Course_name,
            C.Credits,
            C.Sem_id,
            E.Grade_point

        FROM Courses C

        LEFT JOIN Enroll E

        ON

            C.Cid = E.Cid

        AND

            E.Roll_no = %s

        WHERE C.Sem_id = %s

        ORDER BY C.Cid

    """, (

        roll,
        sem

    ))

    data = cursor.fetchall()

    conn.close()

    return data

# ==========================================
# REGISTER
# ==========================================

@app.post("/register")
def register(data: dict = Body(...)):

    conn = get_connection()

    cursor = conn.cursor(dictionary=True)

    roll = data["roll_no"]

    password = data["password"]

    cursor.execute("""

        SELECT *

        FROM Users

        WHERE Roll_no = %s

    """, (roll,))

    existing = cursor.fetchone()

    if existing:

        conn.close()

        return {
            "success": False,
            "message": "User already exists"
        }

    cursor.execute("""

        INSERT INTO Users
        (Roll_no, Password)

        VALUES (%s, %s)

    """, (

        roll,
        password

    ))

    conn.commit()

    conn.close()

    return {
        "success": True
    }

# ==========================================
# LOGIN
# ==========================================

@app.post("/login")
def login(data: dict = Body(...)):

    try:

        conn = get_connection()

        cursor = conn.cursor(dictionary=True)

        roll = data["roll_no"]

        password = data["password"]

        cursor.execute("""

            SELECT

                U.Roll_no,
                U.Password,
                U.Temp_Password,
                U.Role,
                U.First_Login,
                U.Email,

                S.Student_name,
                S.Branch,
                S.Programme,
                S.Admission_Year

            FROM Users U

            LEFT JOIN Student_info S

            ON U.Roll_no = S.Roll_no

            WHERE

                BINARY U.Roll_no = %s

            AND

            (

                BINARY U.Temp_Password = %s

                OR

                BINARY U.Password = %s
            )

        """, (

            roll,
            password,
            password
        ))

        user = cursor.fetchone()

        conn.close()

        if user:

            return {

                "success": True,

                "roll_no":
                    user.get("Roll_no", ""),

                "role":
                    user.get("Role", "student"),

                "first_login":
                    user.get("First_Login", False),

                "name":
                    user.get("Student_name", "Student"),

                "branch":
                    user.get("Branch", "N/A"),

                "programme":
                    user.get("Programme", "N/A"),

                "year":
                    user.get("Admission_Year", 1),

                "sem_id":
                    4,

                "email":
                    user.get("Email", "")
            }

        return {

            "success": False,

            "message":
                "Invalid credentials"
        }

    except Exception as e:

        print("LOGIN ERROR:", str(e))

        return {

            "success": False,

            "message":
                str(e)
        }

# ==========================================
# CHANGE PASSWORD
# ==========================================

@app.post("/change-password")
def change_password(data: dict = Body(...)):

    conn = get_connection()

    cursor = conn.cursor(dictionary=True)

    roll = data["roll_no"]

    new_password = data["new_password"]

    email = data.get("email", "")

    cursor.execute("""

        UPDATE Users

        SET

            Password = %s,

            Email = %s,

            First_Login = FALSE

        WHERE Roll_no = %s

    """, (

        new_password,
        email,
        roll

    ))

    conn.commit()

    conn.close()

    return {

        "success": True,

        "message": "Password updated"
    }

# ==========================================
# RANK LIST
# ==========================================

@app.get("/ranklist")
def ranklist():

    conn = get_connection()

    cursor = conn.cursor(dictionary=True)

    cursor.execute("""

        SELECT *

        FROM student_analytics_view

        ORDER BY Roll_no ASC

    """)

    data = cursor.fetchall()

    conn.close()

    return {

        "total_students": len(data),

        "results": data
    }

# ==========================================
# STUDENT DETAILS
# ==========================================

@app.get("/student/{roll}")
def get_student(roll: str):

    conn = get_connection()

    cursor = conn.cursor(dictionary=True)

    cursor.execute("""

        SELECT *

        FROM student_analytics_view

        WHERE Roll_no = %s

    """, (roll,))

    student = cursor.fetchone()

    cursor.execute("""

        SELECT

            C.Cid,
            C.Course_name,
            C.Credits,
            C.Sem_id,
            E.Grade_point

        FROM Enroll E

        JOIN Courses C

        ON E.Cid = C.Cid

        WHERE E.Roll_no = %s

        ORDER BY C.Sem_id

    """, (roll,))

    subjects = cursor.fetchall()

    conn.close()

    return {

        "student": student,

        "subjects": subjects
    }

# ==========================================
# ADMIN USERS
# ==========================================

@app.get("/admin/users")
def admin_users():

    conn = get_connection()

    cursor = conn.cursor(dictionary=True)

    cursor.execute("""

        SELECT

            Roll_no,
            Temp_Password,
            Password,
            Email,
            First_Login

        FROM Users

        ORDER BY Roll_no ASC

    """)

    data = cursor.fetchall()

    conn.close()

    return data