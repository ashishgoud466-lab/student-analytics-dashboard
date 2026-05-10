import os

print("CURRENT FOLDER:")
print(os.getcwd())

print("\nFILES INSIDE:")
for f in os.listdir():
    print(f)

print("\nJSON FILES:")
jsons = [f for f in os.listdir() if f.endswith(".json")]

print(jsons)
print("COUNT:", len(jsons))