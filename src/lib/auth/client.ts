'use client';

import { nestApiInstance } from '@/constant/api';

import type { User } from '@/types/user';

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
  device?: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  async signUp(_: SignUpParams): Promise<{ error?: string }> {
    return { error: 'Sign up not implemented' };
  }

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    try {
      const res = await nestApiInstance.post('/auth/login', {
        email: params.email,
        password: params.password,
        device: params.device || 'web',
      });

      const { accessToken, refreshToken } = res.data;

      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken); // tuỳ bạn có cần hay không
        return {};
      } else {
        return { error: 'No access token received' };
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Login failed. Please try again.';
      return { error: message };
    }
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update password not implemented' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      return { data: null };
    }

    try {
      const res = await nestApiInstance.get('/auth/me');
      return { data: res.data.data };
    } catch (err: any) {
      return { error: 'Failed to fetch user info' };
    }
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('accessToken');
    return {};
  }
}

export const authClient = new AuthClient();
