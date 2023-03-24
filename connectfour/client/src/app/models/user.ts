import { EmailValidator } from "@angular/forms";
import { Theme } from "./theme";

export interface User {
    _id : string,
    email : EmailValidator,
    password : string,
    defaults : Theme
}