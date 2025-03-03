import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
})
export class ViewComponent implements OnInit {
  displayedColumns: string[] = [
    'sno',
    'studentId',
    'studentName',
    'dob',
    'gender',
    'email',
    'course',
    'sports',
    'address',
    'actions',
  ];

  studentRecords: any[] = [];
  dataSource = new MatTableDataSource<any>(this.studentRecords);
  searchQuery: string = '';
  isModalOpen: boolean = true; // Controls modal visibility

  availableCourses = [
    { id: '1', name: 'Computer Science' },
    { id: '2', name: 'Biology Science' },
    { id: '3', name: 'Commerce' },
    { id: '4', name: 'Humanities' },
  ];

  availableSports = [
    { id: '1', name: 'Football' },
    { id: '2', name: 'Basketball' },
    { id: '3', name: 'Cricket' },
    { id: '4', name: 'Tennis' },
    { id: '5', name: 'Volleyball' },
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router, private datePipe: DatePipe) {}

  ngOnInit(): void {
    const storedRecords = localStorage.getItem('studentRecords');
    if (storedRecords) {
      this.studentRecords = JSON.parse(storedRecords);
      this.sortStudentById();
      this.dataSource.data = this.studentRecords;
    }

    const state = history.state;
    if (state && state.studentRecords) {
      this.studentRecords = state.studentRecords;
      this.sortStudentById();
      this.dataSource.data = this.studentRecords;
    }
  }


  
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Close Modal
  closeModal(): void {
    this.isModalOpen = false;
    this.router.navigate(['/students']);    // Navigate back to the main page
  }

  
  sortStudentById(): void {
    this.studentRecords.sort((a, b) => Number(a.studentId) - Number(b.studentId));
    this.dataSource.data = this.studentRecords;
  }

  getCourseName(courseId: string): string {
    const course = this.availableCourses.find((c) => c.id === courseId);
    return course ? course.name : '';
  }

  getSelectedSports(sports: string[]): string {
    return sports
      .map((sportId: string) => {
        const sport = this.availableSports.find((s) => s.id === sportId);
        return sport ? sport.name : '';
      })
      .filter((name: string) => name !== '')
      .join(', ');
  }


  formatDob(dob: string): string {
    return this.datePipe.transform(dob, 'dd-MM-yyyy') || dob;
  }

  onSearch(): void {
    if (this.searchQuery.trim() === '') {
      this.dataSource.data = this.studentRecords;
    } else {
      this.dataSource.data = this.studentRecords.filter((student) => {
        const query = this.searchQuery.toLowerCase();
        return (
          student.studentId.toLowerCase().includes(query) ||
          student.studentName.toLowerCase().includes(query) ||
          student.email.toLowerCase().includes(query) ||
          this.getCourseName(student.course).toLowerCase().includes(query) ||
          this.getSelectedSports(student.sports).toLowerCase().includes(query)
        );
      });
    }
    this.paginator.pageIndex = 0;
  }

  onDelete(index: number): void {
    if (confirm('Are you sure you want to delete this record?')) {
      this.studentRecords.splice(index, 1);
      localStorage.setItem('studentRecords', JSON.stringify(this.studentRecords));
      this.sortStudentById();
      this.dataSource.data = this.studentRecords;
      alert('Student record deleted successfully!');
    }
  }

  onUpdate(student: any): void {
    this.router.navigate(['/students'], { state: { formData: student } });
  }
}