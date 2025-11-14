import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthDto, CreateUserDto } from '../interfaces/auth'; 

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/user'; 

  constructor(private http: HttpClient) {}

  createUser(createUserDto: CreateUserDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, createUserDto);
  }

  login(authDto: AuthDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, authDto);
  }
}
