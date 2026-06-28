import "./SearchBar.css";

function SearchBar({ searchQuery, onSearchChange }) {
  return (
    <div className="search-bar">
      <label htmlFor="search-users" className="search-bar__label sr-only">
        Search users
      </label>
      <input
        id="search-users"
        className="search-bar__input"
        type="search"
        placeholder="Search by first name, last name or email..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;
