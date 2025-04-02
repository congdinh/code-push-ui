import { ApolloClient, InMemoryCache, ApolloProvider, ApolloLink, gql } from '@apollo/client';

import { RestLink } from 'apollo-link-rest';

import 'src/global.css';

import Fab from '@mui/material/Fab';

import { Router } from 'src/routes/sections';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import { ThemeProvider } from 'src/theme/theme-provider';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const API_URL = 'http://localhost:9007/';
const JWT_TOKEN = '123-x';
// Set `RestLink` with your endpoint
const restLink = new RestLink({ uri: API_URL });

const authRestLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers }: any) => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        ...headers,
        Accept: 'application/json',
        Authorization: token ? `Bearer ${token}` : `Bearer ${JWT_TOKEN}`,
      },
    };
  });
  return forward(operation).map((result) => {
    const { restResponses } = operation.getContext();
    const authTokenResponse = restResponses.find((res: any) => res.headers.has('Authorization'));
    // You might also filter on res.url to find the response of a specific API call
    if (authTokenResponse) {
      localStorage.setItem('token', authTokenResponse.headers.get('Authorization'));
    }
    return result;
  });
});

// Setup your client
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([authRestLink, restLink]),
});

export default function App() {
  useScrollToTop();

  const githubButton = (
    <Fab
      size="medium"
      aria-label="Github"
      href="https://github.com/minimal-ui-kit/material-kit-react"
      sx={{
        zIndex: 9,
        right: 20,
        bottom: 20,
        width: 44,
        height: 44,
        position: 'fixed',
        bgcolor: 'grey.800',
        color: 'common.white',
      }}
    >
      <Iconify width={24} icon="eva:github-fill" />
    </Fab>
  );

  return (
    <ApolloProvider client={client}>
      <ThemeProvider>
        <Router />
        {/* {githubButton} */}
      </ThemeProvider>
    </ApolloProvider>
  );
}
