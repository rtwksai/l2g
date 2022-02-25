import './App.css';

import FileUpload from './components/FileUpload'
import Checkout from './components/Checkout';
// import AddressForm from './components/FileUpload';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Checkout />
      </header>
    </div>
  );
}

export default App;
