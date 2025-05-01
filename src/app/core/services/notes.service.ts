import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NoteData } from '../interfaces/note-data';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  private readonly httpClient = inject(HttpClient);
  constructor() {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  handleAddNotes(newNote: NoteData): Observable<any> {
    return this.httpClient.post(environment.notesUrl, newNote, {
      headers: this.getAuthHeaders(),
    });
  }

  getUserNotes(): Observable<any> {
    return this.httpClient.get<NoteData[]>(environment.notesUrl + '/my-notes', {
      headers: this.getAuthHeaders(),
    });
  }

  handleDeleteNote(noteId: string): Observable<any> {
    return this.httpClient.delete(environment.notesUrl + '/' + noteId, {
      headers: this.getAuthHeaders(),
    });
  }

  handleUpdate(noteData: NoteData, noteId: string): Observable<any> {
    return this.httpClient.put(environment.notesUrl + '/' + noteId, noteData, {
      headers: this.getAuthHeaders(),
    });
  }
}
