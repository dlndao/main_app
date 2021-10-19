import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

import Menu from '../components/menu';
import { useUserState } from 'contexts/UserAuthContext';

export default function RouteWrapper({
  component: Component,
  isAdmin,
  isApp = false,
  isStart = false,
  ...rest
}: any) {
  const { user, isLoading }: any = useUserState();

  const mfi = () => {};
  return (
    <Route
      {...rest}
      render={(props) =>
        // isLoading ? (
        //   <h1>Loading</h1>
        // ) : user ? (
        //   isAdmin && !user?.isAdmin ? (
        //     <Redirect to='/profile' />
        //   ) : !window.location
        //       .toString()
        //       .toLocaleLowerCase()
        //       .includes('dlntezos') ? (
            <>
              <Container fluid>
                <Row>
                  <Col className='px-0'>
                    { !isStart && <Menu isStart={false} />}
                  </Col>
                </Row>
              </Container>
              <main className='dash-page-content py-5'>
                <Container fluid className='px-5 app-container'>
                  <Component {...props} mfiCall={mfi} />
                </Container>
              </main>
            </>
        //   ) : (
        //     <Component {...props} />
        //   )
        // ) : (
        //   <Redirect to='/App/Register' />
        // )
      }
    />
  );
}
