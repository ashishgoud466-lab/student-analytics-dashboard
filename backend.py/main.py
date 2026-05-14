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
# HOME
# ==========================================

@app.get("/")
def home():

    return {

        "message": "Student Analytics API Running"
    }

# ==========================================
# REGISTER
# ==========================================

@app.post("/register")

def register(data: dict = Body(...)):

    conn = get_connection()

    cursor = conn.cursor()

    roll = data["roll_no"]

    password = data["password"]

    # ==========================================
    # CHECK USER EXISTS
    # ==========================================

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

    # ==========================================
    # INSERT USER
    # ==========================================

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

    conn = get_connection()

    cursor = conn.cursor()

    roll = data["roll_no"]

    password = data["password"]

    cursor.execute("""

        SELECT *

        FROM Users

        WHERE Roll_no = %s
        AND Temp_Password = %s

    """, (

        roll,
        password

    ))

    user = cursor.fetchone()

    conn.close()

    if user:

        return {

            "success": True,

            "role": user["Role"],

            "roll_no": user["Roll_no"],

            "first_login": user["First_Login"]
        }

    return {

        "success": False,

        "message": "Invalid credentials"
    }

# ==========================================
# CHANGE PASSWORD
# ==========================================

@app.post("/change-password")

def change_password(data: dict = Body(...)):

    conn = get_connection()

    cursor = conn.cursor()

    roll = data["roll_no"]

    new_password = data["new_password"]

    email = data["email"]

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

@app.get("/ranklist", tags=["Analytics"])

def ranklist():

    conn = get_connection()

    cursor = conn.cursor()

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

    cursor = conn.cursor()

    # ==================================
    # STUDENT INFO
    # ==================================

    cursor.execute("""

        SELECT *

        FROM student_analytics_view

        WHERE Roll_no = %s

    """, (roll,))

    student = cursor.fetchone()

    # ==================================
    # SUBJECTS
    # ==================================

    cursor.execute("""

        SELECT

            C.Cid,
            C.Course_name,
            C.Credits,
            E.Grade_point

        FROM Enroll E

        JOIN Courses C
        ON E.Cid = C.Cid

        WHERE E.Roll_no = %s

    """, (roll,))

    subjects = cursor.fetchall()

    conn.close()

    return {

        "student": student,

        "subjects": subjects
    }

# ==========================================
# ABOVE CLASS AVERAGE
# ==========================================

@app.get("/above-class-average")

def above_average():

    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute(
        queries.students_above_average_query
    )

    data = cursor.fetchall()

    conn.close()

    return data

# ==========================================
# PROGRAMME TOPPERS
# ==========================================

@app.get("/programme-toppers")

def programme_toppers():

    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute(
        queries.programme_toppers_query
    )

    data = cursor.fetchall()

    conn.close()

    return data

# ==========================================
# BACKLOGS
# ==========================================

@app.get("/backlogs")

def backlogs():

    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute(
        queries.backlog_count_query
    )

    data = cursor.fetchall()

    conn.close()

    return data

# ==========================================
# SEARCH
# ==========================================

@app.get("/search/{name}", tags=["Search"])

def search_student(name: str):

    conn = get_connection()

    cursor = conn.cursor()

    query = '''

    SELECT *

    FROM student_analytics_view

    WHERE Student_name LIKE %s

    '''

    cursor.execute(query, (f"%{name}%",))

    data = cursor.fetchall()

    conn.close()

    return data

# ==========================================
# HEALTH
# ==========================================

@app.get("/health")

def health():

    return {

        "status": "running"
    }