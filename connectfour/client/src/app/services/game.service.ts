import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from '../constants/constants';
import { Metadata } from '../models/metadata';
import { Game } from '../models/game';
import { Theme } from '../models/theme';

@Injectable({
  providedIn: 'root'
})
export class GameService{

  private URL : string = Constants.API_VERSION;

  constructor( private http : HttpClient ) {    
  }

  getGame(id : string) : Observable<Game>{
    return this.http.get<Game>(this.URL + "/gids/" + id);
  }

  addMove(id : string, move : number) : Observable<Game>{
    const body = {}

    return this.http.post<Game>(`${this.URL}/gids/${id}/?move=${move}`, body);
  }


}
