import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Dashboard from '../pages/Dashboard';

describe('Dashboard Page', () => {
  it('renders the workspace title', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    expect(screen.getByText('My Workspace')).toBeInTheDocument();
    expect(screen.getByText('Manage and organize your snippets')).toBeInTheDocument();
  });

  it('renders the create paste button', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    expect(screen.getByText('+ New Paste')).toBeInTheDocument();
  });
});
