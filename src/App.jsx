// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import logo from './logo.png';
import './App.css';
import MyComponent from './MyComponent';
import DropdownComponent from './DropdownComponent';
  
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className='text-container '>
        <h6>Nakatomi presents</h6>
        <h1>Eco-Challenge</h1>
        <h4>
          Worlds Toughest Race
        </h4>
    </div>
    <div className="button-container">
        <MyComponent />
        <DropdownComponent />
      </div>
      </header>

    </div>
    
  );
}

export default App;