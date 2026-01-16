import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private readonly API_URL = 'http://localhost:8080/api/students';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Student[]> {
    return this.http.get<Student[]>(this.API_URL);
  }

  getById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.API_URL}/${id}`);
  }

  getByLevel(levelId: number): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.API_URL}/level/${levelId}`);
  }

  getByUserId(userId: number): Observable<Student> {
    return this.http.get<Student>(`${this.API_URL}/user/${userId}`);
  }

  create(student: Partial<Student>): Observable<Student> {
    return this.http.post<Student>(this.API_URL, student);
  }

  update(id: number, student: Partial<Student>): Observable<Student> {
    return this.http.put<Student>(`${this.API_URL}/${id}`, student);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
