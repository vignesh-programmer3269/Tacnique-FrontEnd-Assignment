import "./App.css";
import Header from "./components/Header";
import { useUsers } from "./hooks/useUsers";

function App() {
  const { users, loading, error } = useUsers();

  let content = <p className="app-placeholder__text">Total Users: {users.length}</p>;

  if (loading) {
    content = <p className="app-placeholder__text">Loading users...</p>;
  }

  if (error) {
    content = <p className="app-placeholder__text app-placeholder__text--error">{error}</p>;
  }

  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <div className="app-content">
          <div className="app-placeholder">{content}</div>
        </div>
      </main>
    </div>
  );
}

export default App;
