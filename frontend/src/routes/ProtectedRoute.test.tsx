import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import * as AuthContext from '../context/AuthContext';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/login" element={<div>Login page</div>} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute><div>Secret dashboard content</div></ProtectedRoute>}
        />
      </Routes>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  it('redirects to /login when there is no authenticated user', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: null, token: null, isLoading: false,
      login: vi.fn(), register: vi.fn(), logout: vi.fn(),
    });

    renderAt('/dashboard');
    expect(screen.getByText('Login page')).toBeInTheDocument();
  });

  it('renders protected content when a user is authenticated', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: { id: '1', email: 'alice@example.com', createdAt: '', updatedAt: '' },
      token: 'fake-token', isLoading: false,
      login: vi.fn(), register: vi.fn(), logout: vi.fn(),
    });

    renderAt('/dashboard');
    expect(screen.getByText('Secret dashboard content')).toBeInTheDocument();
  });

  it('shows a loading state instead of redirecting while auth status is still being checked', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: null, token: null, isLoading: true,
      login: vi.fn(), register: vi.fn(), logout: vi.fn(),
    });

    renderAt('/dashboard');
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Login page')).not.toBeInTheDocument();
  });
});