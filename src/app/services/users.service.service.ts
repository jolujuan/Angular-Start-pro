import { Injectable, OnInit } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { Observable, Subject, from, tap } from 'rxjs';
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
export class UsersServiceService implements OnInit {
  supaClient: any = null;

  constructor() {}
  ngOnInit(): void {}

  inicialiTing() {
    this.supaClient = createClient(
      environment.SUPABASE_URL,
      environment.SUPABASE_KEY
    );
  }

  userSubject: Subject<IUser> = new Subject();
  favoritesSubject: Subject<{ id: number; uid: string; artwork_id: string }[]> =
    new Subject();

  async register(email: string, password: string): Promise<any> {
    this.inicialiTing();
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
    this.inicialiTing();
    const { data, error } = await this.supaClient.auth.signInWithPassword({
      email,
      password,
    });
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
    const uid = data.session.user.id;
    localStorage.setItem('uid', uid);
    this.getProfile(uid);

    return { success: true, data };
  }

  getProfile(userId: string): void {
    let profilePromise: Promise<{ data: IUser[] }> = this.supaClient
      .from('profiles')
      .select('*')
      // Filters
      .eq('id', userId);

    from(profilePromise)
      .pipe(tap((data) => console.log(data)))
      .subscribe(async (profile: { data: IUser[] }) => {
        this.userSubject.next(profile.data[0]);
        const avatarFile = profile.data[0].avatar_url.split('/').at(-1);
        const { data, error } = await this.supaClient.storage
          .from('avatars')
          .download(avatarFile);
        const url = URL.createObjectURL(data);
        profile.data[0].avatar_url = url;
        this.userSubject.next(profile.data[0]);
      });
  }

  async setFavorites(artwork_id: string): Promise<void> {
    let { data, error } = await this.supaClient.auth.getSession();
    let promiseFavorites: Promise<boolean> = this.supaClient
      .from('favorites')
      .insert([{ uid: data.session.user.id, artwork_id: artwork_id }]);
    await promiseFavorites;
    //promiseFavorites.then(() => this.getFavorites());
  }

  getFavorites(): void {
    let uid = localStorage.getItem('uid');
    if (uid) {
      let promiseFavorites: Promise<{
        data: { id: number; uid: string; artwork_id: string }[];
      }> = this.supaClient
        .from('favorites')
        .select('*')
        // Filters
        .eq('uid', uid);

      promiseFavorites.then((data) => {
        this.favoritesSubject.next(data.data);
      });
    }
  }

  async isLogged(): Promise<boolean> {
    this.inicialiTing();
    let { data } = await this.supaClient.auth.getSession();
    if (data.session) return true;
    return false;
  }

  async logout() {
    const { error } = await this.supaClient.auth.signOut();
    this.userSubject.next(emptyUser);
  }
}
