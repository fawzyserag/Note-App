import { NgStyle } from '@angular/common';
import Swal from 'sweetalert2';
import {
  Component,
  inject,
  signal,
  model,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import { SideNavComponent } from '../../components/side-nav/side-nav.component';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { NotesService } from '../../core/services/notes.service';
import { NoteData } from '../../core/interfaces/note-data';
import { SearchPipe } from '../../core/pipes/search.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [NgStyle, SideNavComponent, SearchPipe, FormsModule],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css',
})
export class NotesComponent implements OnInit {
  private readonly notesService = inject(NotesService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  readonly animal = signal('');
  readonly name = model('');
  allNotes: NoteData[] = [];
  searchInput: string = '';

  ngOnInit(): void {
    this.notesService.getUserNotes().subscribe({
      next: (res) => {
        console.log(res);

        this.allNotes = res;
      },
      error: (error) => {
        console.error(error);
        if (error.status === 401) {
          localStorage.removeItem('token');
          this.router.navigate(['/signin']);
        }
      },
    });
  }

  openDialog(noteData?: NoteData): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      height: '350px',
      width: '500px',
      data: {
        title: noteData?.title,
        content: noteData?.content,
        _id: noteData?._id,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.animal.set(result);
        this.ngOnInit();
      }
    });
  }

  deleteNotes(deletedNote: string, noteIndex: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.notesService.handleDeleteNote(deletedNote).subscribe({
          next: () => {
            this.allNotes.splice(noteIndex, 1);
            this.ngOnInit();
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
          },
          error: (error) => {
            console.error(error);
          },
        });
      }
    });
  }

  updateData(noteData: NoteData, noteIndex: number) {
    this.openDialog({
      title: noteData.title,
      content: noteData.content,
      _id: noteData._id,
    });
  }
}
