import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import App from './App';

// Mock child components
jest.mock('./views/SearchView', () => () => <div data-testid="search-view">Search View</div>);
jest.mock('./views/ResultView', () => () => <div data-testid="result-view">Result View</div>);

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders SearchView by default', () => {
    render(<App />);
    expect(screen.getByTestId('search-view')).toBeInTheDocument();
    expect(screen.queryByTestId('result-view')).not.toBeInTheDocument();
  });
});
