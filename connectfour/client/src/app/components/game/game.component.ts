import { GameService } from './../../services/game.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Game } from 'src/app/models/game';
import { Theme } from 'src/app/models/theme';
import { Token } from 'src/app/models/token';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent {

  private gameId : string =  '';
  available : boolean = false;
  isWin : boolean = false;
  gameOver : boolean = false;
  showImage : boolean[] = [false, false, false, false, false, false, false];
  gameBoard : Array<Array<string>> = [[]];
  tempToken : Token = {id : -1, name : "", url : ""};
  gameTheme : Theme = {color : "", playerToken : this.tempToken, computerToken : this.tempToken};
  game : Game = {theme : this.gameTheme, id : "", status : "", start : "", finish : "", grid : [[]]};

  constructor(private GameService : GameService,
    private route : ActivatedRoute,
    private router : Router) { }

  ngOnInit() {
    this.route.params.subscribe( params => {
      this.gameId = params['gid'];

      this.GameService.getGame(this.gameId).subscribe( game => {
        this.game = game;
        this.gameBoard = this.game.grid;   
        this.checkWin(game);
      })
    })
  }

  // Check if the game is won to add gifs
  checkWin(game : Game) {
    if (game.status !== "UNFINISHED") {
        this.gameOver = true;
        if (game.status === "VICTORY") {
          this.isWin = true;
        }
      }
  }

  checkAvailable(pos : number) {
    if (this.gameBoard[0][pos] == " " && this.game.status === "UNFINISHED") {
      return true
    }
    return false
  }

  addMove(pos: number) {
    if (this.checkAvailable(pos)) {
      this.GameService.addMove(this.game.id, pos).subscribe (newGame => {
        this.game = newGame;
        this.gameBoard = this.game.grid;
        this.checkWin(newGame);
      })
    }
  }

  counter(i: number) {
    return new Array(i);
  }
}
