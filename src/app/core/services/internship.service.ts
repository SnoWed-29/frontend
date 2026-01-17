import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Internship, InternshipStatus } from '../models';

export interface InternshipSearchCriteria {
  status?: InternshipStatus;
  studentId?: number;
  teacherId?: number;
  levelId?: number;
  sectorId?: number;
  companyName?: string;
  hasReports?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class InternshipService {
  private readonly API_URL = 'http://localhost:8080/api/internships';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Internship[]> {
    return this.http.get<Internship[]>(this.API_URL);
  }

  getById(id: number): Observable<Internship> {
    return this.http.get<Internship>(`${this.API_URL}/${id}`);
  }

  search(criteria: InternshipSearchCriteria): Observable<Internship[]> {
    return this.http.post<Internship[]>(`${this.API_URL}/search`, criteria);
  }

  getByStudent(studentId: number): Observable<Internship[]> {
    return this.http.get<Internship[]>(`${this.API_URL}/student/${studentId}`);
  }

  getByTeacher(teacherId: number): Observable<Internship[]> {
    return this.http.get<Internship[]>(`${this.API_URL}/teacher/${teacherId}`);
  }

  getBySupervisor(supervisorId: number): Observable<Internship[]> {
    return this.http.get<Internship[]>(`${this.API_URL}/teacher/${supervisorId}`);
  }

  create(internship: Partial<Internship>): Observable<Internship> {
    return this.http.post<Internship>(this.API_URL, internship);
  }

  update(id: number, internship: Partial<Internship>): Observable<Internship> {
    return this.http.put<Internship>(`${this.API_URL}/${id}`, internship);
  }

  updateStatus(id: number, status: InternshipStatus): Observable<Internship> {
    return this.http.put<Internship>(`${this.API_URL}/${id}`, { status });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
