"use client"
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import Loading1 from "@/components/loading/Loading1";
import styles from "./page.module.css";

//@ts-ignore
const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Search = () => {

  const [searchType, setSearchType] = useState("domain");
  const [inputValue, setInputValue] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    document.title = "Metopia | " + searchType;
  }, [searchType]);

  const apiEndpoint = `/api/didlocal?key=${encodeURIComponent(searchType)}&value=${encodeURIComponent(searchInput)}`;

  const { data, mutate, error, isLoading } = useSWR(
    searchInput ? apiEndpoint : null,
    fetcher
  );

  const handleSearchTypeChange = (event:any) => {
    setSearchType(event.target.value);
    setInputValue("");
    setSearchInput("");
    setHasSearched(false);
  };

  const handleInputChange = (event:any) => {
    setInputValue(event.target.value);
  };

  const handleSearch = () => {
    setSearchInput(inputValue);
    setHasSearched(true);
  };

  return (
    <div className="relative">
      <div className="">
        <h1
          className={
            "relative text-3xl md:text-5xl font-extrabold leading-tight tracking-tighter text-left pb-2 bg-gradient-to-r from-tw-purple via-tw-blue to-tw-blue text-transparent bg-clip-text"
          }
          style={{
            backgroundImage:
              "url('https://pub-3890daa6d3af4fe09ab0c284ce757dd9.r2.dev/Screen Shot 2023-07-11 at 5.27.25 PM.png')",
            backgroundSize: "cover",
            backgroundPosition: "left",
            height: "100px",
          }}
        >
          {/* {searchType === "domain" ? "Search DID": "Search User"} */}
          Transactions Tracker
        </h1>
        <div className="pb-10">
          <select value={searchType} onChange={handleSearchTypeChange}>
            <option value="domain">Search by DID</option>
            <option value="owner">Search by User</option>
            <option value="txRef">Search by Transaction ID</option>
          </select>
        </div>
        <div className="flex flex-wrap">
          <div className="">
            <div className="">
              <div className={styles.inputwrapper}>
                <input
                  type="text"
                  placeholder={
                    searchType === "domain"
                    ? "Enter a DID"
                    : searchType === "owner"
                    ? "Enter a User"
                    : "Enter a Transaction ID"
                  }
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  className="
                    flex-grow
                    text-sm
                    bg-transparent
                    outline-none
                    border-none
                    ml-2"
                />
                <button 
                  className="
                    w-8 h-8
                    flex items-center justify-center 
                    bg-tw-black
                    text-white
                    rounded-full
                    cursor-pointer
                    transition-colors
                    duration-300
                    ease-in-out
                    hover:bg-tw-grey"
                  onClick={handleSearch}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            {isLoading ? (
            <Loading1 />
            ) : (
              data?.length > 0 ? (
                data.map((post:any) => (
                  <div className="flex items-center pb-4" key={post._id}>
                    <div className="">
                      <div className="flex items-center">
                        <div className="text-lg text-apple-black font-light">
                          <h2>
                            <strong>Domain:</strong> {post.domain}
                          </h2>
                          <h2>
                            <strong>Owner:</strong> {post.owner}
                          </h2>
                          <h2>
                            <strong>Expiry Date:</strong> {post.expiryDate}
                          </h2>
                          <h2>
                            <strong>Transaction ID:</strong> {post.txRef}
                          </h2>
                          <h2>
                            <strong>Transaction Type:</strong> {post.eventName}
                          </h2>
                          {post.oldOwner && (
                            <h2>
                              <strong>Old Owner:</strong> {post.oldOwner}
                            </h2>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                hasSearched && <div>No data matched, please retry.</div>
              )
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;