import { Component, inject, model } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { title } from 'process';
import { NotesService } from '../../core/services/notes.service';
import { NoteData } from '../../core/interfaces/note-data';
// export interface DialogData {
//   animal: string;
//   name: string;
// }
@Component({
  selector: 'app-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
})
export class DialogComponent {
  openDialog() {
    throw new Error('Method not implemented.');
  }
  readonly dialogRef = inject(MatDialogRef<DialogComponent>);
  readonly data = inject<NoteData>(MAT_DIALOG_DATA);
  readonly animal = model(this.data.title);
  private readonly notesService = inject(NotesService);
  name: any;

  onNoClick(): void {
    this.dialogRef.close();
  }

  noteForm: FormGroup = new FormGroup({
    title: new FormControl(this.data.title ? this.data.title : ''),
    content: new FormControl(this.data.content ? this.data.content : ''),
  });

  // noteSubmit(form: FormGroup): void {
  //   if (!this.data.title && !this.data.content) {
  //     this.addNote(form.value);
  //   } else {
  //     this.updateNote(form.value);
  //   }
  // }
  noteSubmit(form: FormGroup): void {
    if (!this.data._id) {
      this.addNote(form.value);
    } else {
      this.updateNote(form.value);
    }
  }

  addNote(newNote: NoteData): void {
    const payload = {
      title: newNote.title,
      content: newNote.content,
      _id: newNote._id,
    };
    this.notesService.handleAddNotes(payload).subscribe({
      next: (res) => {
        console.log(res);
        this.dialogRef.close(true);
      },
      error: (err) => console.log(err),
    });
  }

  updateNote(updateNote: NoteData): void {
    this.notesService.handleUpdate(updateNote, this.data._id).subscribe({
      next: (res) => {
        console.log(res);
        this.dialogRef.close(true);
      },
      error: (err) => console.log(err),
    });
  }
}
