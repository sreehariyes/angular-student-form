import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentsComponent } from './pages/students/students.component';
import { MarksComponent } from './pages/marks/marks.component';
import { PreviewComponent } from './pages/preview/preview.component';
import { ViewComponent } from './pages/view/view.component'; // Import the new ViewComponent

const routes: Routes = [
  { path: 'students', component: StudentsComponent },
  { path: 'marks', component: MarksComponent },
  { path: 'preview', component: PreviewComponent },
  { path: 'view', component: ViewComponent }, // Add route for ViewComponent
  { path: '', redirectTo: '/students', pathMatch: 'full' } // Default route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }