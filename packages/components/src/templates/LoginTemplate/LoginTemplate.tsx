import React, { useState } from 'react';
import { Input } from '../../elements/Input';
import { Button } from '../../elements/Button';
import { Checkbox } from '../../elements/Checkbox';
import './LoginTemplate.css';

export interface LoginTemplateProps {
  /** Logo element to render at the top */
  logo?: React.ReactNode;
  /** Heading title */
  title?: string;
  /** Subtitle text below the title */
  subtitle?: string;
  /** Callback when login form is submitted */
  onLogin?: (email: string, password: string, remember: boolean) => void;
  /** Callback for 'Forgot Password' link */
  onForgotPassword?: () => void;
  /** Callback for 'Sign Up' link */
  onSignUp?: () => void;
  /** Whether the login action is currently loading */
  isLoading?: boolean;
}

/**
 * nir-t-login — Standard Authentication Page Template.
 * Fully composed using Nirmaan UI layer 1 elements.
 */
export function LoginTemplate({
  logo,
  title = 'Welcome back',
  subtitle = 'Please enter your details to sign in.',
  onLogin,
  onForgotPassword,
  onSignUp,
  isLoading = false,
}: LoginTemplateProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin?.(email, password, remember);
  };

  return (
    <div className="nir-t-login">
      <div className="nir-t-login__container">
        <div className="nir-t-login__header">
          {logo && <div className="nir-t-login__logo">{logo}</div>}
          <h1 className="nir-t-login__title">{title}</h1>
          <p className="nir-t-login__subtitle">{subtitle}</p>
        </div>

        <form className="nir-t-login__form" onSubmit={handleSubmit}>
          <div className="nir-t-login__fields">
            <Input
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />
            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
          </div>

          <div className="nir-t-login__actions">
            <Checkbox
              label="Remember me"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            {onForgotPassword && (
              <button
                type="button"
                className="nir-t-login__link"
                onClick={onForgotPassword}
              >
                Forgot password?
              </button>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={isLoading || !email || !password}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        {onSignUp && (
          <div className="nir-t-login__footer">
            <span className="nir-t-login__footer-text">Don't have an account?</span>
            <button
              type="button"
              className="nir-t-login__link nir-t-login__link--strong"
              onClick={onSignUp}
            >
              Sign up
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginTemplate;
