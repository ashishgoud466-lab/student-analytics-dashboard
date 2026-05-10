CREATE DATABASE student_appdemo_db;
USE student_appdemo_db;

CREATE TABLE Student_info (
Roll_no VARCHAR(20) PRIMARY KEY ,
Student_name VARCHAR(50) ,
Branch VARCHAR(50) , 
Programme VARCHAR (50) ,
Admission_Year INT 
);

CREATE TABLE Courses  (
Cid  VARCHAR(20) PRIMARY KEY ,
Course_name VARCHAR(50) ,
Credits INT 
);

CREATE TABLE Semester (
Sem_id INT PRIMARY KEY ,
Current_year INT 
);

CREATE TABLE Enroll (
id INT AUTO_INCREMENT PRIMARY KEY ,
Roll_no VARCHAR(20)  ,
Cid VARCHAR(20)  ,
Sem_id INT  ,
Grade_point INT CHECK (Grade_point BETWEEN 0 and 10),
Attempt INT  DEFAULT 1 ,
is_latest BOOLEAN DEFAULT TRUE ,
FOREIGN KEY ( Roll_no) REFERENCES Student_info(Roll_no),
FOREIGN KEY ( Cid) REFERENCES Courses (Cid),
FOREIGN KEY ( Sem_id) REFERENCES Semester (Sem_id)
);





