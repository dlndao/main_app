import React from 'react';
import { Switch } from 'react-router-dom';
import RouteWrapper from './Route';
import { Route } from 'react-router-dom';

import { CasperAssets } from 'screens/CasperAssets';
import AlertTemplate from 'react-alert-template-basic';
import { positions, Provider, types } from 'react-alert';
import Start from '../pages/start';
import Register from '../pages/register';
import Home from '../pages/home';
import Borrow from '../pages/borrow';
import Withdraw from '../pages/withdraw';
import Repay from '../pages/repay';
import Invest from '../pages/invest';
import AppLogin from '../pages/login';
import Profile from '../pages/profile';
import MfiProposals from 'pages/mfiProposals';
import ResetPassword from 'pages/resetPassword';
import ForgotPassword from 'pages/forgotPassword';
import VerifyCode from 'pages/verifyCode';
import SingleProposalPage from 'pages/singleProposalPage';
import Campaigns from "pages/campaigns";
import CampaignProposals from 'pages/campaignProposals';

function Routes() {
  const options = {
    timeout: 5000,
    position: positions.TOP_RIGHT,
    type: types.ERROR,
  };
  return (
    <Provider template={AlertTemplate} {...options}>
        <Switch>
          <Route exact path='/' component={Start} />
          <Route path='/start' component={Start} />

          <RouteWrapper
            path='/CasperAssets'
            isAdmin={false}
            component={(props) => <CasperAssets {...props} />}
          />
          <RouteWrapper
            path='/App/Start/:mfi?'
            isAdmin={false}
            component={(props) => <Start {...props} />}
            isApp={true}
            isStart={true}
          />
          <RouteWrapper
            path='/App/Register/:mfi?'
            isAdmin={false}
            component={(props) => <Register {...props} />}
            isApp={true}
            isStart={true}
          />
          <RouteWrapper
            path='/App/Home/:mfi?'
            isAdmin={false}
            component={(props) => <Home {...props} />}
            isApp={true}
          />
          <RouteWrapper
            path='/App/Campaigns/:mfi?'
            isAdmin={false}
            component={(props) => <Campaigns {...props} />}
            isApp={true}
          />
          <RouteWrapper
            path='/App/Borrow/:mfi?'
            isAdmin={false}
            component={(props) => <Borrow {...props} />}
            isApp={true}
          />
          <RouteWrapper
            path='/App/Invest/:mfi?'
            isAdmin={false}
            component={(props) => <Invest {...props} />}
            isApp={true}
          />
          <RouteWrapper
            path='/App/Repay/:mfi?'
            isAdmin={false}
            component={(props) => <Repay {...props} />}
            isApp={true}
          />
          <RouteWrapper
            path='/App/Withdraw/:mfi?'
            isAdmin={false}
            component={(props) => <Withdraw {...props} />}
            isApp={true}
          />
          <RouteWrapper
            path='/App/Login/:mfi?'
            isAdmin={false}
            component={(props) => <AppLogin {...props} />}
            isApp={true}
            isStart={true}
          />
          <RouteWrapper
            path='/App/Profile/:mfi?'
            isAdmin={false}
            component={(props) => <Profile {...props} />}
            isApp={true}
          />
          <RouteWrapper
            path='/App/MFIProposals/:mfi?'
            isAdmin={false}
            component={(props) => <MfiProposals {...props} />}
            isApp={true}
          />
          <RouteWrapper
            path='/App/ResetPassword/:mfi?'
            isAdmin={false}
            component={(props) => <ResetPassword {...props} />}
            isApp={true}
            isStart={true}
          />
          <RouteWrapper
            path='/App/ForgotPassword/:mfi?'
            isAdmin={false}
            component={(props) => <ForgotPassword {...props} />}
            isApp={true}
            isStart={true}
          />
             <RouteWrapper
            path='/App/VerifyCode/:mfi?/:phoneNumber?'
            isAdmin={false}
            component={(props) => <VerifyCode {...props} />}
            isApp={true}
            isStart={true}
          />
            <RouteWrapper
            path='/App/proposal'
            isAdmin={false}
            component={(props) => <SingleProposalPage {...props} />}
            isApp={true}
            isStart={true}
          />
             <RouteWrapper
            path='/App/proposalsByCampaign/:mfi?/:id?'
            isAdmin={false}
            component={(props) => <CampaignProposals {...props} />}
            isApp={true}
          />
        </Switch>
    </Provider>
  );
}

export { Routes };
