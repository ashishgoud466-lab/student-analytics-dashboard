import json
import os
import mysql.connector

# ==========================================
# JSON FILE LOCATION
# ==========================================

JSON_FOLDER = r"C:\Users\Ghana shyam\OneDrive\Documents\student app folder\json_student_grade_2-1"

# ==========================================
# MYSQL CONNECTION
conn = mysql.connector.connect(
    host=os.getenv("DB_HOST"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME"),
    port=int(os.getenv("DB_PORT")),
    ssl_disabled=False
)
cursor = conn.cursor()

print("✅ Connected to MySQL")

# ==========================================
# FIND JSON FILES
# ==========================================

json_files = [
    f for f in os.listdir(JSON_FOLDER)
    if f.endswith(".json")
]

print(f"\n📁 JSON FILES FOUND: {len(json_files)}")

# ==========================================
# PROCESS EACH FILE
# ==========================================

for file in json_files:

    print(f"\n📄 Processing {file}")

    filepath = os.path.join(JSON_FOLDER, file)

    try:

        with open(filepath, "r") as f:
            data = json.load(f)

        roll_no = data["roll_no"]
        subjects = data["subjects"]

        print("👤 Roll:", roll_no)
        print("📚 Subjects:", len(subjects))

        # ==========================================
        # DELETE OLD ENROLL DATA
        # ==========================================

        cursor.execute("""
        DELETE FROM Enroll
        WHERE Roll_no = %s
        """, (roll_no,))

        # ==========================================
        # INSERT STUDENT
        # ==========================================

        cursor.execute("""
            INSERT IGNORE INTO Student_info
            (Roll_no, Student_name, Branch, Programme, Admission_Year)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            roll_no,
            "UNKNOWN",
            "CSE",
            "IDDMP",
            2024
        ))

        # ==========================================
        # INSERT SUBJECTS
        # ==========================================

        for sub in subjects:

            cid = sub["cid"]
            course_name = sub["name"]
            credits = sub["credits"]
            gp = sub["gp"]

            # ==========================================
            # INSERT COURSE
            # ==========================================

            cursor.execute("""
                INSERT INTO Courses
                (Cid, Course_name, Credits)
                VALUES (%s, %s, %s)
                ON DUPLICATE KEY UPDATE
                    Course_name = VALUES(Course_name),
                    Credits = VALUES(Credits)
            """, (
                cid,
                course_name,
                credits
            ))

            # ==========================================
            # INSERT ENROLL
            # ==========================================

            cursor.execute("""
                INSERT INTO Enroll
                (Roll_no, Cid, Sem_id, Grade_point)
                VALUES (%s, %s, %s, %s)
            """, (
                roll_no,
                cid,
                1,
                gp
            ))

        print("✅ Inserted successfully")

    except Exception as e:

        print("❌ ERROR:", e)

# ==========================================
# SAVE CHANGES
# ==========================================

conn.commit()

# ==========================================
# VERIFY INSERT
# ==========================================

cursor.execute("""
SELECT COUNT(DISTINCT Roll_no)
FROM Enroll
""")

count = cursor.fetchone()[0]

print("\n🎯 TOTAL STUDENTS INSERTED:", count)

# ==========================================
# CLOSE CONNECTION
# ==========================================

cursor.close()
conn.close()

print("\n🚀 DONE")