import { Theme } from './../../models/theme';
import { Token } from './../../models/token';
import { Component, OnInit } from '@angular/core';
import { Metadata } from '../../models/metadata';
import {Router, ActivatedRoute } from "@angular/router";
import { HomeService } from '../../services/home.service';
import { Game } from 'src/app/models/game';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent implements OnInit{

  tempToken : Token = {id : -1, name : "", url : ""};
  gameTheme : Theme = {color : "", playerToken : this.tempToken, computerToken : this.tempToken};
  metadata : Metadata = {tokens : [], themeDefault : this.gameTheme};
  gameList : Game[] = [];

  constructor(private HomeService : HomeService,
    private route : ActivatedRoute,
    private router : Router, ) { }

  
  ngOnInit() {
    this.getMetadata()
    // Gets the list of games from the server
    this.HomeService.getGameList().subscribe(list => {
      this.gameList = list;
    });

  }

  cancel() {
    this.router.navigate(['home']);
  }
  
  
  getMetadata() {
    this.HomeService.getMeta().subscribe(data => {
      this.metadata = data;
      this.gameTheme.color = this.metadata.themeDefault.color;
      this.gameTheme.playerToken = this.metadata.themeDefault.playerToken;
      this.gameTheme.computerToken = this.metadata.themeDefault.computerToken;
    })

  }

  createGame() {   
    if (this.gameTheme.computerToken !== this.gameTheme.playerToken) {
      this.HomeService.createGame(this.gameTheme).subscribe(game => {    
        this.router.navigate(['/gids/' + game.id]);
      })
    }
  }

  setDefault() {
    // Need To Implement
  }

  printData() {
    console.log(this.gameTheme)
  }
  
}
