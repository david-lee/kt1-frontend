import Login from 'domain/Login';
import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from 'shared/components/Layouts';
import path from 'data/routes';

const Dashboard = lazy(() => import('domain/Dashboard'));
const ResetPassword = lazy(() => import('domain/Login/ResetPassword'));
const ADScheduling = lazy(() => import('domain/ADScheduling'));
const Advertiser = lazy(() => import('domain/Advertiser'));
const ADSales = lazy(() => import('domain/ADSales'));
const Collection = lazy(() => import('domain/Collection'));
const CollectionBills = lazy(() => import('domain/CollectionBills'));
const Subscriber = lazy(() => import('domain/Subscriber'));

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={path.root} element={<Login />} />
      <Route path={path.resetPassword} element={<ResetPassword />} />

      <Route path={path.prefixAuthed} element={<Layout />}>
        <Route path={path.dashboard} element={<Dashboard />} />
        <Route path={path.advertiser}>
          <Route index element={<Advertiser />} />
          <Route path=":userId" element={<Advertiser />} />
          <Route path=":userId/:tabIndex" element={<Advertiser />} />
        </Route>
        <Route path={path.adsales} element={<ADSales />} />
        <Route path={path.collection} element={<Collection />} />
        <Route path={path.collectionBills} element={<CollectionBills />} />
        <Route path={path.scheduleAD} element={<ADScheduling />} />
        <Route path={path.subscriber} element={<Subscriber />} />
        {/* <Route path={path.collectionInvoices} element={<Invoice/>} /> */}
      </Route>

      {/* TODO: make a user-friendly page */}
      <Route path="*" element={<div>Not matched</div>} />
    </Routes>
  );
};

export default AppRoutes;
