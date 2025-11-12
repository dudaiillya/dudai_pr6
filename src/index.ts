enum StudentStatus {
    Active,
    Academic_Leave,
    Graduated,
    Expelled
}

enum CourseType {
    Mandatory,
    Optional,
    Special
}

enum Semester {
    First,
    Second
}

enum Grade {
    Excellent = 5,
    Good = 4,
    Satisfactory = 3,
    Unsatisfactory = 2
}

enum Faculty {
    Computer_Science,
    Economics,
    Law,
    Engineering
}

interface Student {
    id: number;
    fullName: string;
    faculty: Faculty;
    year: number;
    status: StudentStatus;
    enrollmentDate: Date;
    groupNumber: string;
}

interface Course {
    id: number;
    name: string;
    type: CourseType;
    credits: number;
    semester: Semester;
    faculty: Faculty;
    maxStudents: number;
}

interface GradeRecord {
    studentId: number;
    courseId: number;
    grade: Grade;
    date: Date;
    semester: Semester;
}

class UniversityManagementSystem {
    private students: Student[] = [];
    private courses: Course[] = [];
    private registrations: { studentId: number; courseId: number }[] = [];
    private grades: GradeRecord[] = [];
    private nextStudentId: number = 1;
    private nextCourseId: number = 1;

    enrollStudent(student: Omit<Student, 'id'>): Student {
        const newStudent: Student = { id: this.nextStudentId++, ...student };
        this.students.push(newStudent);
        return newStudent;
    }

    addCourse(course: Omit<Course, 'id'>): Course {
        const newCourse: Course = { id: this.nextCourseId++, ...course };
        this.courses.push(newCourse);
        return newCourse;
    }

    registerForCourse(studentId: number, courseId: number): void {
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
        this.registrations.push({ studentId, courseId });
    }

    setGrade(studentId: number, courseId: number, grade: Grade): void {
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
            studentId,
            courseId,
            grade,
            date: new Date(),
            semester: course.semester
        });
    }

    updateStudentStatus(studentId: number, newStatus: StudentStatus): void {
        const student = this.students.find(s => s.id === studentId);
        if (!student) {
            throw new Error('Student not found');
        }
        student.status = newStatus;
    }

    getStudentsByFaculty(faculty: Faculty): Student[] {
        return this.students.filter(s => s.faculty === faculty);
    }

    getStudentGrades(studentId: number): GradeRecord[] {
        return this.grades.filter(g => g.studentId === studentId);
    }

    getAvailableCourses(faculty: Faculty, semester: Semester): Course[] {
        return this.courses.filter(c => c.faculty === faculty && c.semester === semester && this.registrations.filter(r => r.courseId === c.id).length < c.maxStudents);
    }

    calculateAverageGrade(studentId: number): number {
        const studentGrades = this.grades.filter(g => g.studentId === studentId);
        if (studentGrades.length === 0) {
            return 0;
        }
        const total = studentGrades.reduce((sum, g) => sum + g.grade, 0);
        return total / studentGrades.length;
    }

    getExcellentStudentsByFaculty(faculty: Faculty): Student[] {
        return this.students.filter(s => s.faculty === faculty && this.calculateAverageGrade(s.id) >= Grade.Excellent);
    }
}
