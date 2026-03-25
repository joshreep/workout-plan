import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from '../Header';

describe('Header', () => {
  it('renders the title', () => {
    render(<Header storageReady={false} />);
    expect(screen.getByText('Your Training Plan')).toBeInTheDocument();
  });

  it('shows saved indicator when storage is ready', () => {
    render(<Header storageReady={true} />);
    expect(screen.getByText(/Saved/)).toBeInTheDocument();
  });

  it('hides saved indicator when storage is not ready', () => {
    render(<Header storageReady={false} />);
    expect(screen.queryByText(/Saved/)).not.toBeInTheDocument();
  });
});
