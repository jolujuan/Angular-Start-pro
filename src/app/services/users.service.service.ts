import { Injectable, OnInit } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { IUser } from '../interfaces/i-user';

const emptyUser: IUser = {
  id: '0',
  avatar_url: 'none',
  full_name: 'none',
  username: 'none',
};

@Injectable({
  providedIn: 'root',
})
export class UsersServiceService implements OnInit{
  supaClient: any = null;

  constructor() {
   
  }
  ngOnInit(): void {
    
  }

  inicialingSupa(){
    this.supaClient = createClient(
      environment.SUPABASE_URL,
      environment.SUPABASE_KEY
    );
  }

  userSubject: Subject<IUser> = new Subject();
  favoritesSubject: Subject<{ id: number; uid: string; artwork_id: string }[]> =
    new Subject();

  async register(email: string, password: string): Promise<any> {
    const { user, error } = await this.supaClient.auth.signUp({
      email,
      password,
    }); //let data = session.data;
    if (error) {
      if (error.message.includes('Password should be at least 6 characters.')) {
        return {
          success: false,
          message: 'Contraseña mínimo 6 caracteres.',
        };
      } else return { success: false, message: error.message };
    }
    return { success: true, user };
  }

  async login(email: string, password: string): Promise<any> {
    const { data, error } = await this.supaClient.auth.signInWithPassword({
      email,
      password,
    }); //let data = session.data;
    if (error) {
      if (error.message.includes('Email not confirmed')) {
        return {
          success: false,
          message: 'Verifica tu dirección de correo electronico.',
        };
      } else if (error.message.includes('Invalid login credentials')) {
        return {
          success: false,
          message: 'Contraseña o email incorrectos.',
        };
      } else return { success: false, message: error.message };
    }
    console.log(data.session);
    return { success: true, data };
  }

  async setFavorites(artwork_id: string): Promise<void> {
    let { data } = await this.supaClient.auth.getSession();
    await this.supaClient
      .from('favorites')
      .insert([{ uid: data.session.user.id, artwork_id: artwork_id }]);
  }

  async isLogged(): Promise<boolean> {
    this.inicialingSupa();
    let { data } = await this.supaClient.auth.getSession();
    if (data.session) return true;
    return false;
  }

  async logout() {
    const { error } = await this.supaClient.auth.signOut();
    this.userSubject.next(emptyUser);
  }
}
