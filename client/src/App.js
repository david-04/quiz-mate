import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {t} from 'react-switch-lang'

import Main from './views/main'
import Host from './views/host'
import Player from './views/player'
import Editor from './views/editor'
import Page404 from './views/page404'

const loading = () => <div>Ładowanie...</div>;

function App() {

  return (
      <HashRouter>
          <React.Suspense fallback={loading()}>
              <Switch>
                  <Route exact path="/" name="Quizario" render={props => <Main {...props}/>} />
                  <Route exact path="/host" name={t('routing.host')} render={props => <Host {...props}/>} />
                  <Route exact path="/editor" name={t('routing.editor')} render={props => <Editor {...props}/>} />
                  <Route exact path="/player" name={t('routing.player')} render={props => <Player {...props}/>} />
                  <Route exact path="/404" name={t('routing.error404')} render={props => <Page404 {...props}/>} />
                  <Route name="NOT_FOUND" render={props => <Redirect to="/404" {...props}/>} />
              </Switch>
          </React.Suspense>
      </HashRouter>
  );
}

export default App;
