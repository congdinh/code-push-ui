import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { UserView } from 'src/sections/deployment/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Deployments - ${CONFIG.appName}`}</title>
      </Helmet>

      <UserView />
    </>
  );
}
