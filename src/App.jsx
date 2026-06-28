import "./App.css";
import Header from "./components/Header";

function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <div className="app-content">
          <div className="app-placeholder" />
        </div>
      </main>
    </div>
  );
}

export default App;
