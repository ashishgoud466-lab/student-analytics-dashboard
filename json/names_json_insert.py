import mysql.connector

# ==========================================
# MYSQL CONNECTION
import os

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
# INSERT SEMESTER DATA
# ==========================================
cursor.execute("""
    INSERT IGNORE INTO Semester
    (Sem_id, Current_year)
    VALUES (%s, %s)
""", (
    1,
    2
))

print("✅ Semester table updated")


# ==========================================
# STUDENT NAMES
# ==========================================
students = {

    # ==============================
    # M21 - COMPUTER SCIENCE
    # ==============================
    "24011M2101": "Ippili Tejeshwara Rao",
    "24011M2102": "Janamanchi Laxmi Srija",
    "24011M2103": "Mallepally Sri Varshitha Reddy",
    "24011M2104": "Matta Ghana Shyam Goud",
    "24011M2105": "Bonthu Anish Reddy",
    "24011M2106": "Police Sanjana Reddy",
    "24011M2107": "Varahala Navaneeth Krishna",
    "24011M2108": "Kyatham Sanvy Saraswathi Raj",
    "24011M2109": "Garlapally Divya",
    "24011M2110": "Ghantasala G P H Dhruvann",
    "24011M2111": "Advait Gavaravapu",
    "24011M2112": "Bonala Sagar",
    "24011M2113": "Yasa Rithwik Reddy",
    "24011M2114": "Yashwanth Thota",
    "24011M2115": "Tummala Venkata Aneesh",
    "24011M2116": "Ghanate Lakshmi",
    "24011M2117": "Revanth Kovvuri",
    "24011M2118": "B Bhuvana Sai Srivalli",
    "24011M2119": "Narcherla Patel Ranadhir Kartikeya",
    "24011M2120": "Katta Sanvee",

    # ==============================
    # M22 - SOFTWARE ENGINEERING
    # ==============================
    "24011M2201": "Sriranjani Tirumalasetti",
    "24011M2202": "Kotagiri Sri Harshini",
    "24011M2203": "Parthiv Rao Nagineni",
    "24011M2204": "Gajula Nuhita",
    "24011M2205": "Avula Tanush",
    "24011M2206": "Tayyuru Praneeth",
    "24011M2207": "Bhimuni Deepak",
    "24011M2208": "Varun Rajesh",
    "24011M2209": "Kolli Komal Sri Sai Ram",
    "24011M2210": "Samudrala Ajay Gaurav",
    "24011M2211": "Cheela Aksheth Kumar",
    "24011M2212": "Paramsetti Joshith Anwithkar",
    "24011M2213": "Gollangi Anushka",
    "24011M2214": "Shaik Bashid Nawaz Ali",
    "24011M2215": "Pasupuleti Chandra Hasini",
    "24011M2216": "Kopanathi Sri Vennela",
    "24011M2217": "Katamaneni Komal Sai Raghava",
    "24011M2218": "Vedith Krishna Vemulapalli",
    "24011M2219": "Kota Veekshitha",
    "24011M2220": "Pinnapu Reddy Harshitha",

    # ==============================
    # MB5 - AIML
    # ==============================
    "24011MB501": "Madupu Sri Bhuvana",
    "24011MB502": "Munugoti Athreya Ram Sharma",
    "24011MB503": "Ambati Nihal Reddy",
    "24011MB504": "Imran Ansari",
    "24011MB505": "Ayyagari Sai Ram Ajai",
    "24011MB506": "Kandula Sai Mohith Reddy",
    "24011MB507": "Chittepu Abhilash Reddy",
    "24011MB508": "Kanuku Archana",
    "24011MB509": "Vuggi Akaash",

    "24011MB511": "Reema Sree Harshini Manepalli",
    "24011MB512": "Maddineni Bharani Kumar",
    "24011MB513": "Chukka Puneet Sai",
    "24011MB514": "Yellapu Gyan Sagar",
    "24011MB515": "Thodati Divith Reddy",
    "24011MB516": "Boddu Dhiraj Guru Ram",
    "24011MB517": "Sai Renu Keerthana Hastavaram",
    "24011MB518": "Suresh Vadla",
    "24011MB519": "Goparapu Sumanth",
    "24011MB520": "Thota Sree Siddhartha"
}


# ==========================================
# UPDATE DATABASE
# ==========================================
for roll_no, student_name in students.items():

    # --------------------------------------
    # PROGRAMME LOGIC
    # --------------------------------------
    if "M21" in roll_no:
        programme = "Computer Science"

    elif "M22" in roll_no:
        programme = "Software Engineering"

    elif "MB5" in roll_no:
        programme = "AIML"

    else:
        programme = "UNKNOWN"

    # --------------------------------------
    # UPDATE STUDENT_INFO
    # --------------------------------------
    cursor.execute("""
        UPDATE Student_info
        SET
            Student_name = %s,
            Branch = %s,
            Programme = %s,
            Admission_Year = %s
        WHERE Roll_no = %s
    """, (
        student_name,
        "Computer Science and Engineering",
        programme,
        2024,
        roll_no
    ))

    # --------------------------------------
    # UPDATE ENROLL
    # --------------------------------------
    cursor.execute("""
        UPDATE Enroll
        SET Sem_id = %s
        WHERE Roll_no = %s
    """, (
        1,
        roll_no
    ))

    print(f"✅ Updated {roll_no}")


# ==========================================
# SAVE CHANGES
# ==========================================
conn.commit()

cursor.close()
conn.close()

print("\n🚀 ALL STUDENT DETAILS UPDATED")