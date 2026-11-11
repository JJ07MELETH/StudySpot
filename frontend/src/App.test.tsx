import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// A fake backend response with the same shape as the real /api/recommend.
const mockRecommendation = {
  suburb: 'Auckland',
  recommended_type: 'library',
  reason: "It's raining — best to stay indoors!",
  weather: { suburb: 'Auckland', condition: 'rain', description: 'light rain', temp_c: 14 },
};

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders the StudySpot heading', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /studyspot finder/i })).toBeInTheDocument();
});

test('shows a recommendation after searching', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockRecommendation),
  }) as jest.Mock;

  render(<App />);
  fireEvent.change(screen.getByPlaceholderText(/enter your suburb/i), { target: { value: 'Auckland' } });
  fireEvent.click(screen.getByRole('button', { name: /search/i }));

  expect(await screen.findByText('library')).toBeInTheDocument();
  expect(screen.getByText('light rain')).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('suburb=Auckland'));
});

test('shows an error message when the backend fails', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 }) as jest.Mock;

  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /search/i }));

  expect(await screen.findByText(/could not get a recommendation/i)).toBeInTheDocument();
});
