import React from "react"
import { Route, Switch } from "react-router-dom"
import AndroidBackButton from "./components/AndroidBackButton"
import ErrorBoundary from "./components/ErrorBoundary"
import LinkHandler from "./components/LinkHandler"
import { VerticalLayout } from "./components/Layout/Box"
import DesktopNotifications from "./components/DesktopNotifications"
import NotificationContainer from "./components/NotificationContainer"
import AccountPage from "./pages/account"
import AllAccountsPage from "./pages/all-accounts"
import CreateAccountPage from "./pages/create-account"
import SettingsPage from "./pages/settings"
import { appIsLoaded } from "./splash-screen"

const CreateMainnetAccount = () => <CreateAccountPage testnet={false} />
const CreateTestnetAccount = () => <CreateAccountPage testnet={true} />

function Stage2() {
  React.useEffect(() => {
    appIsLoaded()
  }, [])
  return (
    <>
      <VerticalLayout height="100%" style={{ WebkitOverflowScrolling: "touch" }}>
        <VerticalLayout height="100%" grow overflowY="hidden">
          <ErrorBoundary>
            <Switch>
              <Route exact path="/" component={AllAccountsPage} />
              <Route exact path="/account/create/mainnet" component={CreateMainnetAccount} />
              <Route exact path="/account/create/testnet" component={CreateTestnetAccount} />
              <React.Suspense fallback={null}>
                <Route
                  path={["/account/:id/:action/:subaction", "/account/:id/:action", "/account/:id"]}
                  render={props => <AccountPage accountID={props.match.params.id} />}
                />
              </React.Suspense>
              <Route exact path="/settings" component={SettingsPage} />
            </Switch>
          </ErrorBoundary>
        </VerticalLayout>
      </VerticalLayout>
      <NotificationContainer />
      <React.Suspense fallback={null}>
        {/* Notifications need to come after the -webkit-overflow-scrolling element on iOS */}
        <DesktopNotifications />
      </React.Suspense>
      {process.env.PLATFORM === "android" ? <AndroidBackButton /> : null}
      {process.env.PLATFORM === "android" || process.env.PLATFORM === "ios" ? <LinkHandler /> : null}
    </>
  )
}

export default React.memo(Stage2)
