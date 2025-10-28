import { render } from '@testing-library/react';
import { AuthProvider } from '../contexts/AuthContext';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import Home from './Home';

test('renders the home page', () => {
  const { asFragment } = render(
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <Home />
      </AuthProvider>
    </I18nextProvider>
  );
  expect(asFragment()).toMatchSnapshot();
});

