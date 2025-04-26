// frontend/src/components/admin/AdminRoutes.js
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import AdminDashboard from './AdminDashboard';
import ShopVerification from './ShopVerification';
import BlockchainVerification from './BlockchainVerification';
import ComplaintsManager from './ComplaintsManager';
import PlatformStats from './PlatformStats';

const AdminRoutes = () => {
  const { path } = useRouteMatch();
  
  return (
    <AdminLayout>
      <Switch>
        <Route exact path={`${path}`} component={AdminDashboard} />
        <Route path={`${path}/dashboard`} component={AdminDashboard} />
        <Route path={`${path}/shop-verification`} component={ShopVerification} />
        <Route path={`${path}/blockchain`} component={BlockchainVerification} />
        <Route path={`${path}/complaints`} component={ComplaintsManager} />
        <Route path={`${path}/stats`} component={PlatformStats} />
        {/* Add routes for other admin sections */}
      </Switch>
    </AdminLayout>
  );
};

export default AdminRoutes;