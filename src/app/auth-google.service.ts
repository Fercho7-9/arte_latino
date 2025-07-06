import { Injectable } from '@angular/core';
import { OAuthService, OAuthSuccessEvent, OAuthErrorEvent } from 'angular-oauth2-oidc';
import { environment } from '../environments/environments';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGoogleService {
  private readonly _authEventSubject = new Subject<OAuthSuccessEvent | OAuthErrorEvent>();
  authEvent$ = this._authEventSubject.asObservable();

  constructor(private oauthService: OAuthService) {
    this.configureOAuth();
  }

  private configureOAuth() {
    this.oauthService.configure({
      clientId: environment.googleOAuth.clientId,
      redirectUri: environment.googleOAuth.redirectUri,
      scope: environment.googleOAuth.scope,
      responseType: environment.googleOAuth.responseType,
      issuer: environment.googleOAuth.issuer,
    });

    this.oauthService.events.subscribe((event) => {
      if (event instanceof OAuthSuccessEvent || event instanceof OAuthErrorEvent) {
        this._authEventSubject.next(event);
      }
    });
  }

  login() {
    this.oauthService.initCodeFlow();
  }

  logout() {
    this.oauthService.logOut();
  }

  getAccessToken() {
    return this.oauthService.getAccessToken();
  }

  isAuthenticated() {
    return this.oauthService.hasValidAccessToken();
  }
}
