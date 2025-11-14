import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Service } from '../interfaces/service';


@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  private endpoint = 'http://localhost:3000/service';
  constructor(private http: HttpClient) { }


  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(this.endpoint).pipe(
      map(data => 
        data.map(service => ({
          ...service,
          quantityToAdd: 1,
          newPrice: 1,
        }))
      )
    );
  }


  updateServicePrice(id: number, pricePerUnit: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.endpoint}/${id}/price`, { pricePerUnit},{headers});
  }

  deleteService(id: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${this.endpoint}/${id}`, { headers });
  }




createService(serviceData: Service, image: File): Observable<Service> {
  const formData = new FormData();
  formData.append('name', serviceData.name);
  formData.append('pricePerUnit', serviceData.pricePerUnit.toString());
  formData.append('description', serviceData.description);
  formData.append('image', image); 

  const token = localStorage.getItem('authToken'); 
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.post<Service>(this.endpoint, formData, { headers });
}
}
