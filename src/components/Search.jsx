import Fuse from "fuse.js";
import { useState } from "preact/hooks";

// Configs fuse.js
// https://fusejs.io/api/options.html
const options = {
  keys: ["mot"],
  includeMatches: true,
  minMatchCharLength: 2,
  threshold: 0.5,
};

function Search({ searchList }) {
  // User's input
  const [query, setQuery] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [dropdownSelectPosition, setDropdownSelectPosition] = useState(null);
  let isMouseOut = false;
  const fuse = new Fuse(searchList, options);

  function mod(n, m) {
    return ((n % m) + m) % m;
  }

  // Set a limit to the words: 5
  const words = fuse
    .search(query)
    .map((result) => result.item)
    .slice(0, 5);

  function handleOnSearch({ target = {} }) {
    const { value } = target;
    setQuery(value);
    setIsDropdownVisible(true);
  }

  function handleOnFocusOut() {
    if (isMouseOut) {
      setIsDropdownVisible(false);
      setDropdownSelectPosition(null);
      isMouseOut = false;
    }
  }

  function handleOnMouseLeave() {
    isMouseOut = true;
  }

  function handleListControls(event) {
    switch (event.key) {
      case "ArrowDown":
        dropdownSelectPosition === null
          ? setDropdownSelectPosition(0)
          : setDropdownSelectPosition(
              mod(dropdownSelectPosition + 1, words.length)
            );
        event.preventDefault();
        break;
      case "ArrowUp":
        dropdownSelectPosition === null
          ? setDropdownSelectPosition(words.length - 1)
          : setDropdownSelectPosition(
              mod(dropdownSelectPosition - 1, words.length)
            );
        event.preventDefault();
        break;
      case "Enter":
        if (dropdownSelectPosition === null) {
          window.location.href = `/${words[0].mot}`;
        } else {
          window.location.href = `/${words[dropdownSelectPosition].mot}`;
        }
        break;
      case "Escape":
        setIsDropdownVisible(false);
        setDropdownSelectPosition(null);
        isMouseOut = false;
        event.preventDefault();
        break;
      default:
        handleOnSearch(event);
        return; // Quit when this doesn't handle the key event.
    }
  }

  return (
    <div onfocusout={handleOnFocusOut} onMouseLeave={handleOnMouseLeave}>
      <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <svg
          class="w-4 h-4 text-gray-500 dark:text-gray-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          ></path>
        </svg>
        <span class="sr-only">Icone de recherche</span>
      </div>
      <input
        type="text"
        id="search-navbar"
        value={query}
        onInput={handleOnSearch}
        onFocus={handleOnSearch}
        onClick={handleOnSearch}
        onKeyDown={handleListControls}
        placeholder="Rechercher..."
        class="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-yellow-500 dark:focus:border-yellow-500 focus-visible:outline-none"
      />
      {isDropdownVisible && words.length > 0 && (
        <div
          id="dropdown"
          class="z-10 w-full absolute bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700"
        >
          <ul
            class="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDefaultButton"
          >
            {words.map((word, i) => (
              <li>
                <a
                  href={`/${word.mot}`}
                  className={
                    dropdownSelectPosition == i
                      ? "block px-4 py-2 dark:text-white bg-gray-300 dark:bg-gray-500"
                      : "block px-4 py-2 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                  }
                >
                  {word.mot}{" "}
                  <span class="text-yellow-600">
                    {word.nature_abbreviation}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Search;
