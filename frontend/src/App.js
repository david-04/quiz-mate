import { Suspense } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import Editor from "./views/editor";
import Host from "./views/host";
import Main from "./views/main";
import Page404 from "./views/page404";
import Player from "./views/player";

import "bootstrap/dist/css/bootstrap.min.css";

const loading = () => (<div>Loading...</div>);

function App() {
    return (
        <HashRouter>
            <Suspense fallback={loading()}>
                <Routes>
                    <Route exact path="/" name="Main" element={<Main location={window.location} />} />
                    <Route exact path="/host" name="Host mode" element={<Host />} />
                    <Route exact path="/editor" name="Question editor" element={<Editor />} />
                    <Route exact path="/player" name="Player mode" element={<Player />} />
                    <Route exact path="/404" name="Page not found" element={<Page404 />} />
                    <Route name="NOT_FOUND" element={<Navigate replace to="/404" />} />
                </Routes>
            </Suspense>
        </HashRouter>
    );
}

export default App;
