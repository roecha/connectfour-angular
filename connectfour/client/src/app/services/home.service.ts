import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from '../constants/constants';
import { Metadata } from '../models/metadata';
import { Game } from '../models/game';
import { Theme } from '../models/theme';
import { Token } from '../models/token';

@Injectable({
  providedIn: 'root'
})
export class HomeService{

  private URL : string = Constants.API_VERSION;

  constructor( private http : HttpClient ) {    
  }

  getMeta() : Observable<Metadata>{
    return this.http.get<Metadata>(this.URL + "/meta" );
  }

  createGame(gameTheme : Theme) : Observable<Game>{
    let color = gameTheme.color;

    const body = {playerToken : gameTheme.playerToken, computerToken : gameTheme.computerToken}
    return this.http.post<Game>(`${this.URL}/?color=${color.replace("#", "")}`, body);
  }

  getGameList() : Observable<Game[]> {
    return this.http.get<Game[]>(this.URL);
  }

  getDefaults(theme : Theme) : Observable<Theme>{
    
    return this.http.put<Theme>(this.URL + "/defaults", theme);
  }
}
