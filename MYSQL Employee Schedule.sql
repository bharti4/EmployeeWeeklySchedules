create database EmployeeSchedules;

CREATE TABLE EmployeeSchedules.Users (userId int(11) NOT NULL AUTO_INCREMENT, surname varchar(50) NOT NULL,firstname varchar(50) NOT NULL , email varchar(255) NOT NULL UNIQUE, userpassword varchar(250) NOT NULL,PRIMARY KEY (userId));

CREATE table EmployeeSchedules.schedules (scheduleId int(11) NOT NULL AUTO_INCREMENT, userId int(11)  NOT NULL, dayofweek ENUM('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL, starttime TIME NOT NULL, endtime TIME NOT NULL ,agenda varchar(500) NULL , PRIMARY KEY (scheduleId) , 
CONSTRAINT fk_category
    FOREIGN KEY (userId) REFERENCES EmployeeSchedules.users(userId)  ON UPDATE CASCADE ON DELETE CASCADE )
    

