import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import NotFound from '../pages/NotFound';

describe('NotFound Page', () => {
  it('renders the 404 text', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Module Not Found')).toBeInTheDocument();
    expect(screen.getByText('Return to root')).toBeInTheDocument();
  });
});
