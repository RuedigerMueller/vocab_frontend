import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { backend } from './resource.identifiers';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseURL: string;

  constructor(private http: HttpClient) {
    const backendURL: string = environment.backendUrl;
    if ( backendURL.charAt(backendURL.length - 1) === '/') {
      this.baseURL = backendURL.slice(0, -1);
    } else {
      this.baseURL = backendURL;
    }
  }

  public isAuthenticated(): boolean {
    const userData = localStorage.getItem('userInfo');
    if (userData && JSON.parse(userData)){
      return true;
    }
    return false;
  }

  public setUserInfo(accessToken: any){
    localStorage.setItem('userInfo', JSON.stringify(accessToken));
  }

  public validate(username: string, password: string) {
    return this.http.post(`${this.baseURL}/${backend.login}`, {username, password}).toPromise();
  }
}
