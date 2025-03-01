import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css'],
})
export class PreviewComponent implements OnInit {
  studentDetails: any = {
    studentId: '',
    studentName: '',
    dob: '',
    gender: '',
    email: '',
    course: '',
    sports: [],
  };

  studentMarksData: any = {
    marks: {
      mathsMarks: 0,
      englishMarks: 0,
      computerMarks: 0,
    },
    totalMarks: 0,
    percentage: 0,
    grade: '',
    age: 0,
  };

  availableSports = [
    { id: '1', name: 'Football' },
    { id: '2', name: 'Basketball' },
    { id: '3', name: 'Cricket' },
    { id: '4', name: 'Tennis' },
    { id: '5', name: 'Volleyball' },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    const state = history.state;

    if (state && state.studentDetails && state.studentMarksData) {
      this.studentDetails = state.studentDetails;
      this.studentMarksData = state.studentMarksData;

      // Recalculate total, percentage, and grade if missing
      if (!this.studentMarksData.totalMarks || !this.studentMarksData.percentage || !this.studentMarksData.grade) {
        this.calculateTotalAndAverage();
        this.calculatePercentage();
        this.calculateGrade();
      }
    } else {
      this.router.navigate(['/students']);
    }
  }

  calculateTotalAndAverage(): void {
    const { mathsMarks, englishMarks, computerMarks } = this.studentMarksData.marks;
    this.studentMarksData.totalMarks = mathsMarks + englishMarks + computerMarks;
    this.studentMarksData.avgMarks = this.studentMarksData.totalMarks / 3;
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

  getSubjectGrade(marks: number): string {
    if (marks >= 90) {
      return 'A+';
    } else if (marks >= 80) {
      return 'A';
    } else if (marks >= 70) {
      return 'B+';
    } else if (marks >= 60) {
      return 'B';
    } else if (marks >= 50) {
      return 'C';
    } else {
      return 'F';
    }
  }

  getSelectedSports(): string {
    return this.studentDetails.sports
      .map((sportId: string) => {
        const sport = this.availableSports.find((s) => s.id === sportId);
        return sport ? sport.name : '';
      })
      .filter((name: string) => name !== '')
      .join(', ');
  }

  

  onPrint(): void {
    window.print(); 
  }
}