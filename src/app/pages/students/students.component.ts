import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';  // Make sure this is imported if using Material select
import { MatFormFieldModule } from '@angular/material/form-field'; // Make sure this is imported if using Material form-field
import { MatDialog } from '@angular/material/dialog';
import { ViewDialogComponent } from '../view-dialog/view-dialog.component';


@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
})



export class StudentsComponent implements OnInit {
  studentsForm!: FormGroup; // The form group to hold student data
  studentRecords: any[] = []; // Array to store student records
  availableCourses = [ // List of available courses
    { id: '1', name: 'Computer Science' },
    { id: '2', name: 'Biology Science' },
    { id: '3', name: 'Commerce' },
    { id: '4', name: 'Humanities' },
  ];

  availableSports = [ // List of available sports
    { id: '1', name: 'Football' },
    { id: '2', name: 'Basketball' },
    { id: '3', name: 'Cricket' },
    { id: '4', name: 'Tennis' },
    { id: '5', name: 'Volleyball' },
  ];



  
  states: { [key: string]: string[] } = { // Mapping of states to their districts
    Kerala: ['Trivandrum', 'Kollam', 'Alappuzha'],
    Karnataka: ['Bangalore', 'Mysore', 'Mangalore'],
    Goa: ['Panaji', 'Margao'],
  };

  districts: string[] = []; // Array to hold districts based on selected state
  statesList = ['Kerala', 'Karnataka', 'Goa']; // List of states for dropdown

  constructor(private fb: FormBuilder, private dialog: MatDialog,private router: Router) {}

  ngOnInit(): void {
    // Initialize the form with the necessary fields and validations
    this.studentsForm = this.fb.group({
      studentId: ['', Validators.required],
      studentName: ['', Validators.required],
      dob: ['', [Validators.required, this.validateAge.bind(this)]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      state: ['', Validators.required],
      district: ['', Validators.required],
      course: ['', Validators.required],
      sports: [[], Validators.required], // Sports field is an array, so it can store multiple sports
      houseName: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      postOffice: ['', Validators.required],
      pincode: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{6}$'),  
        Validators.maxLength(6),    //validation of pincode
        Validators.minLength(6),
      ]],
    });

    

    // Load stored student records from localStorage if available
    const storedRecords = localStorage.getItem('studentRecords');
    if (storedRecords) {
      this.studentRecords = JSON.parse(storedRecords);
    }

    // Check if form data is passed through navigation state (when editing)
    const state = history.state;
    if (state && state.formData) {
      this.studentsForm.patchValue(state.formData); // Set the form values to the passed data
      const selectedState = state.formData.state;
      if (selectedState) {
        this.districts = this.states[selectedState] || []; // Load districts based on selected state
      }
    }

    // Listen for state changes to update the available districts dynamically
    this.studentsForm.get('state')?.valueChanges.subscribe((state) => {
      this.districts = this.states[state] || []; // Update districts based on selected state
      this.studentsForm.get('district')?.setValue(''); // Reset district field
    });
  }

  // Custom validator to ensure the student is at least 18 years old
  validateAge(control: any): { [key: string]: boolean } | null {
    const dob = new Date(control.value);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();

    // If the age is less than 18, return an error
    if (age < 18) {
      alert('Student must be at least 18 years old.');
      return { underAge: true };
    }
    return null;
  }

  // Handles the change of the state selection and updates available districts
  onStateChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const state = target.value;
    this.districts = this.states[state] || []; // Update districts based on state change
    this.studentsForm.get('district')?.setValue(''); // Reset district field
  }

  openViewDialog(): void {
    // Add class to body to prevent scrolling
    document.body.classList.add('dialog-open');
  
    // Open the dialog
    const dialogRef = this.dialog.open(ViewDialogComponent, {
      width: '500px',
      data: this.studentsForm.value,
    });
  
    // Remove class from body when the dialog is closed
    dialogRef.afterClosed().subscribe(() => {
      document.body.classList.remove('dialog-open');
    });
  }
  







  // Handles form submission add or updation of student record
  onSubmit(): void {
    if (this.studentsForm.valid) {
      const formData = this.studentsForm.value; // Get form data

      // Check if the student already exists based on studentId
      const existingStudentIndex = this.studentRecords.findIndex(
        (student) => student.studentId === formData.studentId
      );

      // If student exists, update the record, else add a new one
      if (existingStudentIndex !== -1) {
        this.studentRecords[existingStudentIndex] = formData;
        alert('Student record updated successfully!');
      } else {
        this.studentRecords.push(formData);
        alert('New student record added successfully!');
      }

      // Save updated records to localStorage
      localStorage.setItem('studentRecords', JSON.stringify(this.studentRecords));
    } else {
      alert('Please fill in all required fields.'); // If the form is not valid
    }
  }

  // Handles navigating to the marks page after submitting the form
  onNext(): void {
    if (this.studentsForm.valid) {
      const formData = this.studentsForm.value; // Get form data
      this.router.navigate(['/marks'], {
        state: { studentId: formData.studentId, formData: formData, studentRecords: this.studentRecords }, // Pass data to the next page
      });
    } else {
      alert('Please fill in all required fields.'); // If form is invalid
    }
  }

  //  navigation to the view page to view the records
  onView(): void {
    this.router.navigate(['/view'], {
      state: { studentRecords: this.studentRecords, formData: this.studentsForm.value }, // Pass student records and form data to the view page
    });
  }

  // Handles changes to studentId and pre-fills the form if the student is found
  onStudentIdChange(): void {
    const studentId = this.studentsForm.get('studentId')?.value;
    if (studentId) {
      const student = this.studentRecords.find((record) => record.studentId === studentId);
      if (student) {
        this.studentsForm.patchValue(student); // Populate form with the found student data
        const selectedState = student.state;
        if (selectedState) {
          this.districts = this.states[selectedState] || []; // Update districts based on selected state
        }
      } else {
        alert('Student not found!'); // If student is not found, show an alert
      }
    } else {
      // Reset form if studentId is empty
      this.studentsForm.reset();
      this.districts = []; 
    }
  }
}





