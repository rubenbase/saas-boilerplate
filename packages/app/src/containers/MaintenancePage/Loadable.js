/**
 *
 * Asynchronously loads the component for MaintenancePage
 *
 */

import loadable from 'loadable-components';

import LoadingIndicator from 'components/LoadingIndicator';

export default loadable(() => import('./index'), {
  LoadingComponent: LoadingIndicator,
});
