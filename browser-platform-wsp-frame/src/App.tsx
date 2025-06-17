import { useIOConnect } from "@interopio/react-hooks";
import Workspaces from "@interopio/workspaces-ui-react";
import "@interopio/workspaces-ui-react/dist/styles/workspaces.css";

const App = () => {
    useIOConnect(async (io) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).io = io;
    });

    return <Workspaces />
};

export default App;
