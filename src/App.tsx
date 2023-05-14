import { Router, Route, Routes, A } from "@solidjs/router";
import styles from "./App.module.css";
import Home from "./routes/Home";
import ERC4337 from "./routes/ERC4337";
import { RiSystemMenu4Fill } from 'solid-icons/ri';
import { createSignal } from "solid-js";

export default function App() {
    const [fullscreen, setFullscreen] = createSignal(false);

    function onFullscreenButton() {
        setFullscreen(f => !f);
    }

    return <div class={[styles.layout, fullscreen() && styles.fullscreen].join(" ")}>
        <header>
            <button onClick={onFullscreenButton}><RiSystemMenu4Fill/></button>
            <div>
                ERC4337
                <br />
                PLAYGROUND
            </div>
            <button>
                Connect Wallet
            </button>
        </header>
        <nav>
            <A href="/home" activeClass={styles.selected}>Home</A>
            <A href="/4337/" activeClass={styles.selected}>ERC-4337</A>
            <A href="/about/" activeClass={styles.selected}>The Playground</A>
        </nav>
        <main>
            <Routes>
                <Route path="/" component={Home} />
                <Route path="/4337" component={ERC4337} />
            </Routes>
        </main>
    </div>
}