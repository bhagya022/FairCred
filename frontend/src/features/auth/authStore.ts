class AuthStore {
  get token(): string | null {
    return localStorage.getItem('token');
  }
  
  get user(): string | null {
    return localStorage.getItem('username');
  }

  setAuth(token: string, user: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('username', user);
  }

  clear() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  }
}

export const authStore = new AuthStore();
