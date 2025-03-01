import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-marks',
  templateUrl: './marks.component.html',
  styleUrls: ['./marks.component.css'],
})
export class MarksComponent implements OnInit {
  studentMarksData: any = {
    studentId: '',
    studentName: '',
    dob: '',
    age: null,
    marks: {
      mathsMarks: null,
      englishMarks: null,
      computerMarks: null,
    },
    totalMarks: null,
    avgMarks: null,
    percentage: null,
    grade: '',
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    const state = history.state;

    if (state && state.studentId && state.formData) {
      // Populate student details
      this.studentMarksData.studentId = state.formData.studentId;
      this.studentMarksData.studentName = state.formData.studentName;
      this.studentMarksData.dob = state.formData.dob;
      this.calculateAge();

      // Populate marks data if coming back from preview
      if (state.studentMarksData) {
        this.studentMarksData.marks = state.studentMarksData.marks;
        this.studentMarksData.totalMarks = state.studentMarksData.totalMarks;
        this.studentMarksData.avgMarks = state.studentMarksData.avgMarks;
        this.studentMarksData.percentage = state.studentMarksData.percentage;
        this.studentMarksData.grade = state.studentMarksData.grade;
      }
    } else {
      this.router.navigate(['/students']);
    }
  }

  calculateAge(): void {
    const dob = new Date(this.studentMarksData.dob);
    const diff = Date.now() - dob.getTime();
    const ageDate = new Date(diff);
    this.studentMarksData.age = Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  calculateTotalAndAverage(): void {
    const { mathsMarks, englishMarks, computerMarks } = this.studentMarksData.marks;
    this.studentMarksData.totalMarks = mathsMarks + englishMarks + computerMarks;
    this.studentMarksData.avgMarks = this.studentMarksData.totalMarks / 3;
    this.calculatePercentage();
    this.calculateGrade();
  }

  calculatePercentage(): void {
    const totalMarks = this.studentMarksData.totalMarks;
    const maxMarks = 300; // Assuming each subject has a maximum of 100 marks
    this.studentMarksData.percentage = ((totalMarks / maxMarks) * 100).toFixed(2);
  }

  calculateGrade(): void {
    const percentage = this.studentMarksData.percentage;

    if (percentage >= 90) {
      this.studentMarksData.grade = 'A+';
    } else if (percentage >= 80) {
      this.studentMarksData.grade = 'A';
    } else if (percentage >= 70) {
      this.studentMarksData.grade = 'B+';
    } else if (percentage >= 60) {
      this.studentMarksData.grade = 'B';
    } else if (percentage >= 50) {
      this.studentMarksData.grade = 'C';
    } else {
      this.studentMarksData.grade = 'F';
    }
  }

  onDobChange(): void {
    this.calculateAge();
  }

  validateMarks(subject: string): void {
    let value = this.studentMarksData.marks[subject];

    if (value < 0) {
      value = 0;
    } else if (value > 100) {
      value = 100;
    }

    this.studentMarksData.marks[subject] = value;
    this.calculateTotalAndAverage();
  }

  onPreview(): void {
    this.router.navigate(['/preview'], {
      state: {
        studentDetails: history.state.formData, 
        studentMarksData: this.studentMarksData, 
      },
    });
  }

  onBack(): void {
    this.router.navigate(['/students'], {
      state: { formData: history.state.formData },
    });
  }
}