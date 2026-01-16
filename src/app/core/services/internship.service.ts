import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Internship, InternshipStatus } from '../models';

export interface InternshipSearchCriteria {
  status?: InternshipStatus;
  studentId?: number;
  supervisorId?: number;
  companyName?: string;
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
    let params = new HttpParams();
    
    if (criteria.status) {
      params = params.set('status', criteria.status);
    }
    if (criteria.studentId) {
      params = params.set('studentId', criteria.studentId.toString());
    }
    if (criteria.supervisorId) {
      params = params.set('supervisorId', criteria.supervisorId.toString());
    }
    if (criteria.companyName) {
      params = params.set('companyName', criteria.companyName);
    }

    return this.http.get<Internship[]>(`${this.API_URL}/search`, { params });
  }

  getByStudent(studentId: number): Observable<Internship[]> {
    return this.http.get<Internship[]>(`${this.API_URL}/student/${studentId}`);
  }

  getBySupervisor(supervisorId: number): Observable<Internship[]> {
    return this.http.get<Internship[]>(`${this.API_URL}/supervisor/${supervisorId}`);
  }

  create(internship: Partial<Internship>): Observable<Internship> {
    return this.http.post<Internship>(this.API_URL, internship);
  }

  update(id: number, internship: Partial<Internship>): Observable<Internship> {
    return this.http.put<Internship>(`${this.API_URL}/${id}`, internship);
  }

  updateStatus(id: number, status: InternshipStatus): Observable<Internship> {
    return this.http.patch<Internship>(`${this.API_URL}/${id}/status`, { status });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
