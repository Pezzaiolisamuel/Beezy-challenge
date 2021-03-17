import './App.css';
import {BrowserRouter} from 'react-router-dom'; 

import Tiles from "./containers/Tiles/Tiles";


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <h1>Pokemon collection</h1>
          
          <Tiles />
        
      </div>
    </BrowserRouter>
  );
}

export default App;
