import { createRoot } from 'react-dom/client';
import { MainView } from './components/main-view/main-view';
import { BrowserRouter } from 'react-router-dom';
import "./index.scss";

// Main component 
const MyFlixApplication = () => {
  return (
    <BrowserRouter>
      <MainView />
    </BrowserRouter>
  );
 };

// Finds the root of your app
const container = document.querySelector("#root");
const root = createRoot(container);

// Tells React to render your app in the root DOM element
root.render(<MyFlixApplication />);