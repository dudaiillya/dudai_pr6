dist/index.js"use strict";
const StudentStatus = {
    Active: 0,
    Academic_Leave: 1,
    Graduated: 2,
    Expelled: 3
};
const CourseType = {
    Mandatory: 0,
    Optional: 1,
    Special: 2
};
const Semester = {
    First: 0,
    Second: 1
};
const Grade = {
    Excellent: 5,
    Good: 4,
    Satisfactory: 3,
    Unsatisfactory: 2
};
const Faculty = {
    Computer_Science: 0,
    Economics: 1,
    Law: 2,
    Engineering: 3
};
class UniversityManagementSystem {
    constructor() {
        this.students = [];
        this.courses = [];
        this.registrations = [];
        this.grades = [];
        this.nextStudentId = 1;
        this.nextCourseId = 1;
    }
    enrollStudent(student) {
        const newStudent = Object.assign({ id: this.nextStudentId++ }, student);
        this.students.push(newStudent);
        return newStudent;
    }
    addCourse(course) {
        const newCourse = Object.assign({ id: this.nextCourseId++ }, course);
        this.courses.push(newCourse);
        return newCourse;
    }
    registerForCourse(studentId, courseId) {
        const student = this.students.find(s => s.id === studentId);
        const course = this.courses.find(c => c.id === courseId);
        if (!student || !course) {
            throw new Error('Student or course not found');
        }
        if (student.faculty !== course.faculty) {
            throw new Error('Faculty mismatch');
        }
        if (student.status !== StudentStatus.Active) {
            throw new Error('Student is not active');
        }
        const enrolledCount = this.registrations.filter(r => r.courseId === courseId).length;
        if (enrolledCount >= course.maxStudents) {
            throw new Error('Course is full');
        }
        const already = this.registrations.some(r => r.studentId === studentId && r.courseId === courseId);
        if (already) {
            throw new Error('Student already registered');
        }
        this.registrations.push({ studentId: studentId, courseId: courseId });
    }
    setGrade(studentId, courseId, grade) {
        const student = this.students.find(s => s.id === studentId);
        const course = this.courses.find(c => c.id === courseId);
        if (!student || !course) {
            throw new Error('Student or course not found');
        }
        const registered = this.registrations.some(r => r.studentId === studentId && r.courseId === courseId);
        if (!registered) {
            throw new Error('Student is not registered for the course');
        }
        this.grades.push({
            studentId: studentId,
            courseId: courseId,
            grade: grade,
            date: new Date(),
            semester: course.semester
        });
    }
    updateStudentStatus(studentId, newStatus) {
        const student = this.students.find(s => s.id === studentId);
        if (!student) {
            throw new Error('Student not found');
        }
        student.status = newStatus;
    }
    getStudentsByFaculty(faculty) {
        return this.students.filter(s => s.faculty === faculty);
    }
    getStudentGrades(studentId) {
        return this.grades.filter(g => g.studentId === studentId);
    }
    getAvailableCourses(faculty, semester) {
        return this.courses.filter(c => c.faculty === faculty && c.semester === semester && this.registrations.filter(r => r.courseId === c.id).length < c.maxStudents);
    }
    calculateAverageGrade(studentId) {
        const studentGrades = this.grades.filter(g => g.studentId === studentId);
        if (studentGrades.length === 0) {
            return 0;
        }
        const total = studentGrades.reduce((sum, g) => sum + g.grade, 0);
        return total / studentGrades.length;
    }
    getExcellentStudentsByFaculty(faculty) {
        return this.students.filter(s => s.faculty === faculty && this.calculateAverageGrade(s.id) >= Grade.Excellent);
    }
}
module.exports = { StudentStatus, CourseType, Semester, Grade, Faculty, UniversityManagementSystem };
