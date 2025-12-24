import "./App.css";
import Footer from "./components/footer";
import Header from "./components/header";

function App() {
  return (
    
    <div className="App">
      <Header />
      <div className="flex h-screen justify-center">
        <h1 className="text-3xl font-bold">RELATOS DE PAPEL</h1>
      </div>
      <Footer/>
    </div>
    
  );
}

export default App;
