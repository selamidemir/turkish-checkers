
import './App.css';
import Content from './components/Content';
import Header from './components/Header';
import Aside from './components/Aside';
import Footer from './components/Footer';

function App() {
  return (
    <div className="layout">
        <Header />
        <div className='lspace'></div>
        <Content />
        <Aside />
        <div className='rspace'></div>
        <Footer />
    </div>
  );
}

export default App;
