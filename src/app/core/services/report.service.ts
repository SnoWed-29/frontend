import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Report } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private readonly API_URL = 'http://localhost:8080/api/reports';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Report[]> {
    return this.http.get<Report[]>(this.API_URL);
  }

  getById(id: number): Observable<Report> {
    return this.http.get<Report>(`${this.API_URL}/${id}`);
  }

  getByInternship(internshipId: number): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.API_URL}/internship/${internshipId}`);
  }

  create(report: Partial<Report>): Observable<Report> {
    return this.http.post<Report>(this.API_URL, report);
  }

  update(id: number, report: Partial<Report>): Observable<Report> {
    return this.http.put<Report>(`${this.API_URL}/${id}`, report);
  }

  grade(id: number, grade: number, feedback?: string): Observable<Report> {
    return this.http.patch<Report>(`${this.API_URL}/${id}/grade`, { grade, feedback });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
