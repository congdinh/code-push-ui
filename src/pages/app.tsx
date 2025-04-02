import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { UserView } from 'src/sections/app/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Apps - ${CONFIG.appName}`}</title>
      </Helmet>

      <UserView />
    </>
  );
}
