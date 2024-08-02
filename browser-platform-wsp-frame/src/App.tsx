import Workspaces from "@interopio/workspaces-ui-react";
import { useIOConnect } from '@interopio/react-hooks';
import "@interopio/workspaces-ui-react/dist/styles/workspaces.css";

function App() {
  useIOConnect(async (io) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).io = io;
});
  
  return (
    <Workspaces />
  )
}

export default App
