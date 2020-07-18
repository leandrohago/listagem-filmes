import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Filme } from '../shared/models/filme';
import { ConfigParamsService } from './config-params.service';
import { ConfigParams } from '../shared/models/config-params';

const url = 'http://localhost:3000/filmes/'

@Injectable({
  providedIn: 'root'
})
export class FilmesService {
  
  constructor(private http: HttpClient,
    private configService: ConfigParamsService) { }

  salvar(filme: Filme): Observable<any> {
    return this.http.post<Filme>(url, filme)
  }

  listar(config: ConfigParams): Observable<Filme[]>{
    const configParams = this.configService.configurarParametros(config)
    return this.http.get<Filme[]>(url,{params: configParams})
  }

}
