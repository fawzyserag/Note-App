import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignupComponent } from './pages/signup/signup.component';
import { SigninComponent } from "./pages/signin/signin.component";
import { NotesComponent } from "./pages/notes/notes.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'noteapp';
}
