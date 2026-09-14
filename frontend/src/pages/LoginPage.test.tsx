import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from './LoginPage';
import * as AuthContext from '../context/AuthContext';
import { ApiError } from '../api/client';

describe('LoginPage', () => {
  it('calls login with the entered email and password on submit', async () => {
    const loginMock = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: null, token: null, isLoading: false,
      login: loginMock, register: vi.fn(), logout: vi.fn(),
    });

    render(<MemoryRouter><LoginPage /></MemoryRouter>);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'alice@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'supersecret123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith('alice@example.com', 'supersecret123');
    });
  });

  it('shows the real API error message when login fails', async () => {
    const loginMock = vi.fn().mockRejectedValue(new ApiError(401, 'Invalid email or password'));
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: null, token: null, isLoading: false,
      login: loginMock, register: vi.fn(), logout: vi.fn(),
    });

    render(<MemoryRouter><LoginPage /></MemoryRouter>);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'alice@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid email or password');
  });
});