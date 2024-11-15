import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ResultView from '../views/ResultView';
import { getRecentCaptures, getArchiveCaptures, getFutureOpportunities } from '../api/imageryApi';

jest.mock('../api/imageryApi', () => ({
    getRecentCaptures: jest.fn(),
    getArchiveCaptures: jest.fn(),
    getFutureOpportunities: jest.fn(),
}));

describe('ResultView', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders recent imagery tab by default', () => {
        render(
            <MemoryRouter initialEntries={[{ state: { showTimeline: false } }]}>
                <ResultView />
            </MemoryRouter>
        );

        // Check the heading and active tab
        expect(screen.getByRole('heading', { name: /Recent Imagery/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Recent Imagery/i })).toHaveClass('active');
    });

    test('switches to timeline view when "Timeline" tab is clicked', async () => {
        (getArchiveCaptures as jest.Mock).mockResolvedValueOnce({
            features: [
                {
                    type: 'Feature',
                    geometry: { type: 'Point', coordinates: [-74.006, 40.7128] },
                    properties: { captureId: 'CAP123', captureDate: '2023-11-01T10:15:30Z', resolution: '5m' },
                },
            ],
        });

        render(
            <MemoryRouter initialEntries={[{ state: { showTimeline: true } }]}>
                <ResultView />
            </MemoryRouter>
        );

        // Switch to timeline tab
        const timelineTab = screen.getByRole('button', { name: /Timeline/i });
        fireEvent.click(timelineTab);

        await waitFor(() => {
            expect(getArchiveCaptures).toHaveBeenCalled();
        });

        expect(screen.getByRole('heading', { name: /Timeline/i })).toBeInTheDocument();
    });

    test('renders recent captures in carousel view', async () => {
        (getRecentCaptures as jest.Mock).mockResolvedValueOnce([
            { captureId: 'CAP123', location: { lat: 40.7128, lon: -74.006 }, captureDate: '2023-11-01T10:15:30Z', resolution: '5m' },
        ]);

        render(
            <MemoryRouter>
                <ResultView />
            </MemoryRouter>
        );

        const recentTab = screen.getByRole('button', { name: /Recent Imagery/i });
        fireEvent.click(recentTab);

        await waitFor(() => {
            expect(screen.getByAltText(/Satellite view of CAP123/i)).toBeInTheDocument();
        });
    });

    test('renders archive captures in timeline view', async () => {
        const mockData = {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    geometry: { type: 'Point', coordinates: [-58.3816, -34.6037] },
                    properties: {
                        captureId: 'CAP12346',
                        captureDate: '2023-11-01T10:15:30Z',
                        resolution: '5m'
                    }
                },
            ]
        };
      
        (getArchiveCaptures as jest.Mock).mockResolvedValueOnce(mockData);
      
        render(
          <MemoryRouter initialEntries={[{ state: { showTimeline: true } }]}>
            <ResultView />
          </MemoryRouter>
        );
      
        // Click on Timeline tab
        const timelineTab = screen.getByRole('button', { name: /Timeline/i });
        fireEvent.click(timelineTab);
      
        // Wait for the mock function to be called
        await waitFor(() => {
          expect(getArchiveCaptures).toHaveBeenCalled();
        });
      });
      

    test('renders future opportunities in timeline view', async () => {
        (getFutureOpportunities as jest.Mock).mockResolvedValueOnce([
            { opportunityId: 'OP123', estimatedCaptureDate: '2023-12-01T08:00:00Z', confidence: 'High' },
        ]);

        render(
            <MemoryRouter initialEntries={[{ state: { showTimeline: true } }]}>
                <ResultView />
            </MemoryRouter>
        );

        // Click on Timeline tab
        const timelineTab = screen.getByRole('button', { name: /Timeline/i });
        fireEvent.click(timelineTab);

        // Wait for data to load
        await waitFor(() => {
            expect(getFutureOpportunities).toHaveBeenCalled();
        });

        // Verify rendered content
        const timelineItems = screen.queryAllByRole('listitem'); // Use queryAllByRole to handle cases with 0 items
        expect(timelineItems.length).toBeGreaterThan(0);

        const futureOpportunity = within(timelineItems[0]);
        expect(futureOpportunity.getByText(/Estimated Date:/i)).toBeInTheDocument();
        expect(futureOpportunity.getByText(/12\/1\/2023/i)).toBeInTheDocument();
    });


});
