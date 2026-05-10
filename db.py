import mysql.connector

conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="Student_appdemo_db"
)

cursor = conn.cursor(dictionary=True)

print("✅ Database Connected")