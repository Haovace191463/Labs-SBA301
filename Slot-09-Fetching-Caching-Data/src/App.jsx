import AsyncTrace from "./exercises/AsyncTrace";
import PromiseCreation from "./exercises/PromiseCreation";
import PromiseComposition from "./exercises/PromiseComposition";
import AsyncAwait from "./exercises/AsyncAwait";
import FetchGet from "./exercises/FetchGet";
import FetchPost from "./exercises/FetchPost";
import AxiosDemo from "./exercises/AxiosDemo";
import HttpCache from "./exercises/HttpCache";
import ReactStateMachine from "./exercises/ReactStateMachine";
import RaceCondition from "./exercises/RaceCondition";
import UserListDataClient from "./mini-project/UserListDataClient";

function App() {
    return (
        <div>
            <h1>SBA301 - Slot 09</h1>
            <h2>Fetching • Caching • React Data</h2>

            <hr/>

            <AsyncTrace/>

            <hr/>

            <PromiseCreation/>

            <hr/>

            <PromiseComposition/>

            <hr/>

            <AsyncAwait/>

            <hr/>

            <FetchGet/>

            <hr/>

            <FetchPost/>

            <hr/>

            <AxiosDemo/>

            <hr/>

            <HttpCache/>

            <hr/>

            <ReactStateMachine/>

            <hr/>

            <RaceCondition/>

            <hr/>

            <UserListDataClient/>

        </div>
    );
}

export default App;