import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Level, Sector } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MetadataService {
  private readonly API_URL = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getLevels(): Observable<Level[]> {
    return this.http.get<Level[]>(`${this.API_URL}/levels`);
  }

  getSectors(): Observable<Sector[]> {
    return this.http.get<Sector[]>(`${this.API_URL}/sectors`);
  }

  getSectorsByLevel(levelId: number): Observable<Sector[]> {
    return this.http.get<Sector[]>(`${this.API_URL}/sectors/level/${levelId}`);
  }
}
