import os
import mysql.connector

def get_connection():

    db_host = os.environ.get("DB_HOST")
    db_port = os.environ.get("DB_PORT")
    db_user = os.environ.get("DB_USER")
    db_password = os.environ.get("DB_PASSWORD")
    db_name = os.environ.get("DB_NAME")

    print("DB_HOST:", db_host)
    print("DB_PORT:", db_port)

    conn = mysql.connector.connect(

        host=db_host,

        port=int(db_port) if db_port else 11574,

        user=db_user,

        password=db_password,

        database=db_name,

        ssl_disabled=False
    )

    return conn