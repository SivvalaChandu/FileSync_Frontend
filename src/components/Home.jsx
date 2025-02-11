import React, { useEffect, useState, useContext, useMemo } from "react";
import Card from "./Card";
import { Link } from "react-router-dom";
import { IoSearchSharp } from "react-icons/io5";
import { MdAdd } from "react-icons/md";
import CardsWave from "../utils/CardsWave";
import axiosInstance from "../utils/axiosInstance";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [type, setType] = useState(1);
  const [searchIcon, setSearchIcon] = useState(false);
  const [posts, setPosts] = useState(null);
  const [filterPosts, setFilterPosts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const sortedPosts = useMemo(() => {
    if (!filterPosts) return [];

    const parseDate = (dateStr) => {
      try {
        // Handle missing/undefined dates by returning oldest possible date
        if (!dateStr) return new Date(0); // 1970-01-01 as fallback

        const parts = dateStr.split(" ");
        if (parts.length < 5) return new Date(0); // Invalid format

        const [day, month, year, time, period] = parts;
        const [hours, minutes] = time.split(":");

        const monthMap = {
          jan: 0,
          feb: 1,
          mar: 2,
          apr: 3,
          may: 4,
          jun: 5,
          jul: 6,
          aug: 7,
          sep: 8,
          oct: 9,
          nov: 10,
          dec: 11,
        };

        let parsedHours = parseInt(hours, 10);
        if (period === "PM" && parsedHours !== 12) parsedHours += 12;
        if (period === "AM" && parsedHours === 12) parsedHours = 0;

        return new Date(
          parseInt(year, 10),
          monthMap[month.toLowerCase()],
          parseInt(day, 10),
          parsedHours,
          parseInt(minutes, 10)
        );
      } catch (error) {
        console.error("Error parsing date:", dateStr, error);
        return new Date(0); // Fallback for invalid dates
      }
    };

    return [...filterPosts].sort((a, b) => {
      const dateA = parseDate(a?.createdAt); // Optional chaining
      const dateB = parseDate(b?.createdAt);
      return dateB - dateA;
    });
  }, [filterPosts]);

  useEffect(() => {
    console.log("home page fetched");
    console.log(user);

    fetchAllPosts();
  }, [user]);

  const sortData = (allPosts) => {
    return allPosts.sort((a, b) => new Date(b.time) - new Date(a.time));
  };

  const fetchAllPosts = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/v1/post/all/${user}`);
      const allPosts = await sortData(response.data);
      console.log(allPosts);

      setPosts(allPosts);
      setFilterPosts(allPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]); // Set to empty array on error
      setFilterPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    search(e.target.value);
  };

  const search = (query) => {
    console.log("Searching for:", query);
    if (query.trim() === "") {
      setFilterPosts(posts);
    }
    const filter = posts.filter((q) =>
      q.title.toLowerCase().includes(query.trim().toLowerCase())
    );
    setFilterPosts(filter);
  };

  const fileTypeSort = (fileType) => {
    if (!posts) return;

    if (fileType === "all") {
      setFilterPosts(posts);
      return;
    }
    console.log("fetching");

    const imageExtensions = [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "bmp",
      "webp",
      "tiff",
      "svg",
      "heic",
      "raw",
      "cr2",
      "nef",
      "arw",
      "psd",
      "ai",
      "eps",
    ];

    switch (fileType.toLowerCase()) {
      case "text":
        setFilterPosts(posts.filter((q) => q.type === "Text"));
        break;

      case "image":
        setFilterPosts(
          posts.filter(
            (q) =>
              q.type === "image" ||
              (q.type &&
                (imageExtensions.includes(q.type.toLowerCase()) ||
                  q.type.toLowerCase().startsWith("image/")))
          )
        );
        break;
      default:
        setFilterPosts(
          posts.filter(
            (q) =>
              q.type !== "Text" &&
              q.type !== "image" &&
              !imageExtensions.includes(q.type?.toLowerCase())
          )
        );
    }
  };
  const fileTypeClick = (num) => {
    num === 1
      ? fileTypeSort("all")
      : num === 2
      ? fileTypeSort("text")
      : num === 3
      ? fileTypeSort("image")
      : fileTypeSort("file");
    setType(num);
  };

  return (
    <div className="px-5 md:px-10 lg:px-14 py-3 dark:bg-primary flex flex-1 flex-col">
      <div className="flex justify-between items-center">
        <div className=" text-xl md:text-2xl dark:text-gray-200 font-bold">
          Personal
        </div>
        <div className="flex gap-5">
          <IoSearchSharp
            onClick={() => setSearchIcon(!searchIcon)}
            className="size-7 md:size-8 mt-2 text-gray-500 cursor-pointer"
          />
          <Link
            to={"/post"}
            className="mt-1 py-2 inline-block px-4 text-lg font-bold text-white bg-blue-400 rounded-full"
          >
            <MdAdd className="inline -mx-1 mb-0.5 font-extrabold dark:text-black text-center size-6" />
            <p className="dark:text-black hidden md:inline"> New</p>
          </Link>
        </div>
      </div>
      <div className="px-2 py-3">
        {searchIcon && (
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Type your search and press Enter...."
            className={`px-6 py-2 rounded-3xl w-full border-2 dark:bg-primary dark:text-white dark:placeholder-gray-400 ${
              isFocused
                ? "border-gray-500 dark:border-gray-400 outline-none"
                : "border-gray-300 dark:border-gray-500"
            } `}
          />
        )}
        <div className="flex gap-4 py-3">
          <div
            className={`p-1 cursor-pointer font-medium text-center  border ${
              type === 1
                ? "font-semibold text-blue-400 border-blue-400"
                : "border-gray-400 dark:text-gray-200"
            }  w-16 rounded-2xl`}
            onClick={() => fileTypeClick(1)}
          >
            All
          </div>
          <div
            className={`p-1 cursor-pointer text-center border ${
              type === 2
                ? "font-semibold text-blue-400 border-blue-400"
                : "border-gray-400 dark:text-gray-200"
            } w-16 rounded-2xl`}
            onClick={() => fileTypeClick(2)}
          >
            Text
          </div>
          <div
            className={`p-1 cursor-pointer text-center border ${
              type === 3
                ? "font-semibold text-blue-400 border-blue-400"
                : "border-gray-400 dark:text-gray-200"
            } w-16 rounded-2xl`}
            onClick={() => fileTypeClick(3)}
          >
            Images
          </div>
          <div
            className={`p-1 cursor-pointer text-center border ${
              type === 4
                ? "font-semibold text-blue-400 border-blue-400"
                : "border-gray-400 dark:text-gray-200"
            } w-16 rounded-2xl`}
            onClick={() => fileTypeClick(4)}
          >
            Files
          </div>
        </div>
      </div>
      <div className="lg:pl-6 flex flex-wrap justify-start gap-4 md:ml-[4%]">
        {isLoading ? ( // Show loading state
          <CardsWave />
        ) : posts && posts.length === 0 ? ( // No posts at all
          <div className="w-full pt-32 select-none flex justify-center items-center">
            <div>
              <div className="text-xl text-center font-bold text-gray-400 dark:text-gray-500">
                Add your first synchronised data
              </div>
              <div className="text-xl font-bold text-center text-gray-400 dark:text-gray-600">
                No posts found
              </div>
            </div>
          </div>
        ) : sortedPosts.length > 0 ? ( // Has filtered posts
          sortedPosts.map((post, i) => (
            <Card key={i} updateFetch={fetchAllPosts} prop={post} />
          ))
        ) : (
          // No matching posts after search/filter
          <div className="w-full pt-32 select-none flex justify-center items-center">
            <div className="text-xl font-bold text-center text-gray-400 dark:text-gray-600">
              No matching posts found
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
