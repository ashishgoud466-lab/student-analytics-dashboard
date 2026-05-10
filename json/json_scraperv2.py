import json
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

# ==========================================
# FIXED SAVE LOCATION
# ==========================================
SAVE_FOLDER = r"C:\Users\Ghana shyam\OneDrive\Documents\Student app folder"

# create folder if not exists
os.makedirs(SAVE_FOLDER, exist_ok=True)

print("📁 Saving JSON files to:")
print(SAVE_FOLDER)


# ==========================================
# EXTRACT ROLL NUMBER
# ==========================================
def extract_roll_no(text):

    for line in text.split("\n"):

        parts = line.split()

        if len(parts) > 0 and parts[0].startswith("240"):
            return parts[0]

    return None


# ==========================================
# PARSE SUBJECT DATA
# ==========================================
def parse_data(text):

    subjects = []

    for line in text.split("\n"):

        parts = line.split()

        # valid subject rows only
        if (
            len(parts) >= 5
            and parts[0][:2].isdigit()
            and parts[0][2].isalpha()
        ):

            try:
                cid = parts[0]
                credits = float(parts[-3])
                gp = int(float(parts[-2]))
                subject_name = " ".join(parts[1:-3])

                subjects.append({
                    "cid": cid,
                    "name": subject_name,
                    "credits": credits,
                    "gp": gp
                })

            except:
                continue

    return subjects


# ==========================================
# BROWSER SETUP
# ==========================================
options = Options()
options.add_argument("--ignore-certificate-errors")
options.add_argument("--ignore-ssl-errors")

driver = webdriver.Chrome(options=options)

# ==========================================
# OPEN RESULT PAGE
# ==========================================
driver.get(
    "https://results.jntuhceh.ac.in/result/4328c63dbc8d7178214cc819e54e2327"
)

print("\n👉 Enter hall ticket in browser")
print("👉 Click 'Get Result'")
print("👉 Then press ENTER here\n")

input("⏳ Waiting...")

# ==========================================
# GET PAGE TEXT
# ==========================================
text = driver.find_element(By.TAG_NAME, "body").text

driver.quit()

# ==========================================
# PROCESS DATA
# ==========================================
roll_no = extract_roll_no(text)
subjects = parse_data(text)

# validation
if not roll_no:
    print("❌ Roll number not found")
    exit()

if not subjects:
    print("❌ Subjects not found")
    exit()

# ==========================================
# CREATE JSON DATA
# ==========================================
data = {
    "roll_no": roll_no,
    "subjects": subjects
}

# ==========================================
# SAVE JSON FILE
# ==========================================
filename = os.path.join(SAVE_FOLDER, f"{roll_no}.json")

with open(filename, "w") as f:
    json.dump(data, f, indent=4)

# ==========================================
# SUCCESS OUTPUT
# ==========================================
print(f"\n✅ JSON saved successfully")
print("📄 File:", filename)

print("\n📚 Subjects:", len(subjects))

print("\n📁 Files currently in folder:")

for f in os.listdir(SAVE_FOLDER):
    if f.endswith(".json"):
        print(f)