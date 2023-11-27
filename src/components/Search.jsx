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
      <input
        type="text"
        id="search-navbar"
        value={query}
        onInput={handleOnSearch}
        onFocus={handleOnSearch}
        onClick={handleOnSearch}
        onKeyDown={handleListControls}
        placeholder="Rechercher un mot..."
        class="block w-full h-12 p-2 pe-16 ps-8 text-md text-gray-900 border focus:border-2 box-border border-gray-400 rounded-full bg-transparent focus:ring-yellow-500 focus:border-yellow-500 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-yellow-500 dark:focus:border-yellow-500 focus-visible:outline-none z-30 relative"
      />
      <div class="absolute inset-y-0 end-0 flex items-center justify-center pointer-events-none bg-yellow-500 dark:bg-yellow-500 rounded-full w-12 h-12 z-10">
        <svg
          class="w-4 h-4 text-gray-800"
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
      {isDropdownVisible && words.length > 0 && (
        <div
          id="dropdown"
          class="z-10 w-11/12 left-1/2 transform -translate-x-1/2 md:left-auto md:transform-none md:w-4/5 md:ml-5 absolute bg-white/40 divide-y divide-gray-100 rounded-b-lg shadow-md backdrop-blur dark:bg-slate-700/40"
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
                      ? "text-base block px-4 py-2 dark:text-white bg-gray-300 dark:bg-slate-500/40"
                      : "text-base block px-4 py-2 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-600/40"
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
