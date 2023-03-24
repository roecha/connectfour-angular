import { Theme } from "./theme";

export interface Game {
    theme : Theme,
    id : string,
    status : string,
    start : string,
    finish : string,
    grid : Array<Array<string>>
}