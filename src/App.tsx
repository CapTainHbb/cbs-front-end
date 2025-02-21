import React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip'

//import Scss
import './assets/scss/themes.scss';

//imoprt Route
import Route from './Routes';

// Fake Backend 
import fakeBackend from "./helpers/AuthType/fakeBackend";
import {ToastContainer} from "react-toastify";


// Activating fake backend
fakeBackend();

function App() {
  return (
    <React.Fragment>
      <ToastContainer autoClose={2000} closeButton={false} limit={2} />
      <Route />
      <ReactTooltip id="tooltip" style={{fontSize: '18px'}} />
    </React.Fragment>
  );
}

export default App;
