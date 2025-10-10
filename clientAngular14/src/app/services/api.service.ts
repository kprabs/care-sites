import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Facility {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiBaseUrl;
  constructor(private http: HttpClient) {}

  getLabs(): Observable<Facility[]>       { return this.http.get<Facility[]>(`${this.base}/api/labs`); }
  getPT(): Observable<Facility[]>         { return this.http.get<Facility[]>(`${this.base}/api/pt`); }
  getRadiology(): Observable<Facility[]>  { return this.http.get<Facility[]>(`${this.base}/api/radiology`); }
}
