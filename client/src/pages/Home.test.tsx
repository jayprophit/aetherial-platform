import { render } from '@testing-library/react';
import { AuthProvider } from '../contexts/AuthContext';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import Home from './Home';

// The auth context reads the live tRPC session. This test renders the
// page without a tRPC provider, so supply an anonymous session.
vi.mock('@/lib/trpc', () => ({
  trpc: {
    auth: {
      me: { useQuery: () => ({ data: null, isLoading: false }) },
      logout: { useMutation: () => ({ mutateAsync: vi.fn() }) },
    },
    useUtils: () => ({
      auth: { me: { setData: vi.fn(), invalidate: vi.fn() } },
    }),
  },
}));

// Keep the test off the network and snapshot the settled empty feed,
// not the initial loading spinner.
vi.mock('../lib/api', () => ({
  api: {
    posts: {
      getAll: vi.fn().mockResolvedValue([]),
      create: vi.fn(),
      like: vi.fn(),
    },
  },
}));

test('renders the home page', async () => {
  const { asFragment, findByText } = render(
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <Home />
      </AuthProvider>
    </I18nextProvider>
  );
  await findByText('no_posts_yet');
  expect(asFragment()).toMatchSnapshot();
});

