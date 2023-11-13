import { signal, computed, effect } from "@preact/signals-react";

// you can export the signal to use it anywhere in the application.
// I am thinking to do a GlobalStore file that have all the global signals.

const count = signal(0);
const double = computed(() => count.value * 2);

import Button from "../components/Button";

/**
 * Home Page
 */

const Home = () => {
    effect(() => console.log(count.value));
return (
    <div className="flex flex-col p-16 items-center gap-10">
        <h1 className="text-primary font-bold text-2xl">React Signal DEMO</h1>
        <Button onClick={() => count.value++}>Signal Count: {count.value}</Button>
        <p>Double is {double}</p>
    </div>
);
}

export default Home;
