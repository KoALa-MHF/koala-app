import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';

interface JWToken {
  exp: number;
  iat: number;
  sub: number;
}

class KoalaUserStorage {
  accessToken?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AccessTokenService {
  storedUser: KoalaUserStorage = new KoalaUserStorage();

  constructor() {
    const savedUser = sessionStorage.getItem('koala-user');

    if (savedUser) {
      this.storedUser = JSON.parse(savedUser);
    }
  }

  public getAccessToken() {
    if (this.isAccessTokenValid(this.storedUser.accessToken)) {
      return this.storedUser.accessToken;
    } else {
      return null;
    }
  }

  public getLoggedInUserId(): number {
    const decoded: JWToken = jwt_decode(this.storedUser.accessToken || '');

    return decoded.sub;
  }

  public isAccessTokenValid(accessToken?: string): boolean {
    if (accessToken) {
      const jwtTokenDecoded: JWToken = jwt_decode(accessToken);

      return new Date(jwtTokenDecoded.exp * 1000) > new Date();
    } else {
      return false;
    }
  }

  public removeAccessToken() {
    delete this.storedUser.accessToken;
    sessionStorage.removeItem('koala-user');
  }

  public setAccessToken(accessToken: string) {
    this.storedUser.accessToken = accessToken;
    this.storeUser();
  }

  private storeUser() {
    sessionStorage.setItem('koala-user', JSON.stringify(this.storedUser));
  }
}
