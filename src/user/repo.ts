import { Pool } from "pg";
import { getClient } from "../database";
import { User } from "../models/User";

    export async function getAllUsers(): Promise<User[]> {
        try {
        const pool = getClient()
          const query = 'SELECT * FROM "users"';
          const result = await pool.query(query);
      
          if (result.rows.length === 0) {
            return [];
          }
      
          return result.rows as User[];
        } catch (error) {
          throw new Error(`Error fetching users: ${error}`);
        }
    };

    export async function getUserByEmail(email: string): Promise<User | undefined> {
        try {
        const pool = getClient()
          const query = 'SELECT * FROM "users" WHERE email = $1';
          const values = [email];
          const result = await pool.query(query, values);
      
          if (result.rows.length === 0) {
            return undefined;
          }
      
          return result.rows[0] as User;
        } catch (error) {
            console.log(error)
          throw new Error(`Error fetching user by email: ${error}`);
        }
    };

    export async function createUser(user: User): Promise<void> {
        try {
        const pool = getClient()
        const query = 'INSERT INTO "users" (id, firstname, lastname, email, password) VALUES ($1, $2, $3, $4, $5)';
        const values = [user.id, user.firstname, user.lastname, user.email, user.password];
        await pool.query(query, values);
        return
        } catch (error) {
            console.error(error)
          throw new Error(`Error creating user: ${error}`);
        }
    };
