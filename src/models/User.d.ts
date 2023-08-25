import { Settings } from "http2";
import { BaseModel } from "./BaseModel";

export interface User extends BaseModel {
    firstname: string
 lastname: string
  email: string;
  password: string;
}