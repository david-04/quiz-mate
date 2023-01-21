import { Suspense } from "react";
import { HashRouter, Navigate, Route, Routes, useParams } from "react-router-dom";

import { onExitGame } from "./utilities";
import Editor from "./views/editor";
import Host from "./views/host";
import Main from "./views/main";
import Page404 from "./views/page404";
import Player from "./views/player";

import "bootstrap/dist/css/bootstrap.min.css";

onExitGame();

const loading = () => (<div>Loading...</div>);

const MainOrNotFound = () => { // NOSONAR
    const params = useParams();
    console.log(params);
    return /^\d+$/.test(params.roomCode) && "404" !== params.roomCode
        ? <Main location={window.location} roomCode={params.roomCode} />
        : <Navigate replace to="/404" />;
};

function normalizeHash() {
    const hash = (window.location.hash || "").trim().replace(/^#/, "").trim();
    if (hash && !hash.startsWith("/")) {
        window.location.hash = `/${hash}`;
    }
}

function App() {
    normalizeHash();
    return (
        <HashRouter>
            <Suspense fallback={loading()}>
                <Routes>
                    <Route exact path="/" name="Main" element={<Main location={window.location} />} />
                    <Route exact path="/host" name="Host mode" element={<Host />} />
                    <Route exact path="/editor" name="Question editor" element={<Editor />} />
                    <Route exact path="/player" name="Player mode" element={<Player />} />
                    <Route exact path="/404" name="Page not found" element={<Page404 />} />
                    <Route path="/:roomCode" name="Main (pre-populated)" element={<MainOrNotFound />} />
                    <Route path="*" element={<Navigate replace to="/404" />} />
                </Routes>
            </Suspense>
        </HashRouter>
    );
}

export default App;
