import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Teacher } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private readonly API_URL = 'http://localhost:8080/api/teachers';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(this.API_URL);
  }

  getById(id: number): Observable<Teacher> {
    return this.http.get<Teacher>(`${this.API_URL}/${id}`);
  }

  getBySector(sectorId: number): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(`${this.API_URL}/sector/${sectorId}`);
  }

  getByUserId(userId: number): Observable<Teacher> {
    return this.http.get<Teacher>(`${this.API_URL}/user/${userId}`);
  }

  create(teacher: Partial<Teacher>): Observable<Teacher> {
    return this.http.post<Teacher>(this.API_URL, teacher);
  }

  update(id: number, teacher: Partial<Teacher>): Observable<Teacher> {
    return this.http.put<Teacher>(`${this.API_URL}/${id}`, teacher);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
