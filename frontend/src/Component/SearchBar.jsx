import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { FiSearch, FiX } from 'react-icons/fi'
import { IoTimeOutline } from 'react-icons/io5'
import { listingDataContext } from '../Context/ListingContext'
import { debounce } from '../utils/debounce'
import {
  addRecentSearch,
  getRecentSearches,
  clearRecentSearches,
  QUICK_SUGGESTIONS,
} from '../utils/searchHelper'

function SearchBar({ className = '' }) {
  const [input, setInput] = useState('')
  const [open, setOpen] = useState(false)
  const [searching, setSearching] = useState(false)
  const [recentSearches, setRecentSearches] = useState([])
  const [highlightId, setHighlightId] = useState(null)
  const wrapRef = useRef(null)

  const {
    searchData,
    handleSearch,
    handleViewCard,
    setSearchData,
  } = useContext(listingDataContext)

  const runSearch = useCallback(async (value) => {
    const trimmed = value.trim()
    if (!trimmed) {
      setSearchData([])
      setOpen(false)
      setSearching(false)
      return
    }
    setSearching(true)
    await handleSearch(trimmed)
    setOpen(true)
    setSearching(false)
  }, [handleSearch, setSearchData])

  const debouncedSearch = useCallback(debounce((v) => runSearch(v), 250), [runSearch])

  useEffect(() => {
    debouncedSearch(input)
  }, [input, debouncedSearch])

  useEffect(() => {
    setRecentSearches(getRecentSearches())
  }, [])

  useEffect(() => {
    const onClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const selectResult = (id, term) => {
    if (term) addRecentSearch(term)
    setRecentSearches(getRecentSearches())
    setOpen(false)
    setInput('')
    setHighlightId(id)
    handleViewCard(id)
  }

  const applySuggestion = (term) => {
    setInput(term)
    addRecentSearch(term)
    setRecentSearches(getRecentSearches())
    runSearch(term)
  }

  const clearInput = () => {
    setInput('')
    setSearchData([])
    setOpen(false)
  }

  const showDropdown = open && (input.trim() || recentSearches.length > 0)
  const hasResults = searchData?.length > 0

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <div className="search-bar">
        <FiSearch className="w-5 h-5 text-brand-gray flex-shrink-0" />
        <input
          type="text"
          className="flex-1 bg-transparent outline-none text-sm md:text-base text-brand-dark placeholder:text-brand-muted min-w-0"
          placeholder="Search city, villa, pool house, landmark..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && input.trim()) {
              addRecentSearch(input.trim())
              setRecentSearches(getRecentSearches())
              runSearch(input)
            }
          }}
        />
        {input && (
          <button type="button" onClick={clearInput} className="p-1 text-brand-gray hover:text-brand-dark flex-shrink-0" aria-label="Clear search">
            <FiX className="w-4 h-4" />
          </button>
        )}
        <button
          type="button"
          className="p-2 rounded-full bg-brand-pink text-white hover:bg-brand-pink-dark transition-colors flex-shrink-0 w-9 h-9 flex items-center justify-center"
          aria-label="Search"
          onClick={() => input.trim() && runSearch(input)}
        >
          <FiSearch className="w-4 h-4" />
        </button>
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-card border border-brand-border overflow-hidden z-50 max-h-96 overflow-y-auto">
          {searching && (
            <p className="px-4 py-3 text-sm text-brand-gray">Searching...</p>
          )}

          {!searching && !input.trim() && recentSearches.length > 0 && (
            <div className="px-4 py-2 border-b border-brand-border">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-brand-gray uppercase">Recent</span>
                <button type="button" onClick={() => { clearRecentSearches(); setRecentSearches([]) }} className="text-xs text-brand-pink hover:underline">
                  Clear
                </button>
              </div>
              {recentSearches.map((term) => (
                <button
                  key={term}
                  type="button"
                  className="w-full text-left py-2 text-sm flex items-center gap-2 hover:text-brand-pink"
                  onClick={() => applySuggestion(term)}
                >
                  <IoTimeOutline className="w-4 h-4 text-brand-gray" />
                  {term}
                </button>
              ))}
            </div>
          )}

          {!searching && !input.trim() && (
            <div className="px-4 py-3 border-b border-brand-border">
              <p className="text-xs font-semibold text-brand-gray uppercase mb-2">Popular</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_SUGGESTIONS.map((term) => (
                  <button
                    key={term}
                    type="button"
                    className="px-3 py-1 text-xs rounded-full border border-brand-border hover:border-brand-pink hover:text-brand-pink transition-colors"
                    onClick={() => applySuggestion(term)}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!searching && input.trim() && hasResults && searchData.map((item) => (
            <button
              key={item._id}
              type="button"
              className={`w-full text-left px-4 py-3 hover:bg-brand-light transition-colors border-b border-brand-border last:border-0 ${
                highlightId === item._id ? 'bg-brand-pink/10 border-l-4 border-l-brand-pink pl-3' : ''
              }`}
              onClick={() => selectResult(item._id, input.trim())}
            >
              <p className="font-medium text-brand-dark truncate">{item.title}</p>
              <p className="text-sm text-brand-gray truncate">{item.landMark}, {item.city}</p>
            </button>
          ))}

          {!searching && input.trim() && !hasResults && (
            <p className="px-4 py-4 text-sm text-brand-gray text-center">No properties found for &ldquo;{input}&rdquo;</p>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBar
