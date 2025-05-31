import { useState, useEffect, useCallback } from "react";
import SearchBar from "./components/SearchBar/SearchBar";
import ImageGallery from "./components/ImageGallery/ImageGallery";
import Loader from "./components/Loader/Loader";
import LoadMoreBtn from "./components/LoadMoreBtn/LoadMoreBtn";
import ImageModal from "./components/ImageModal/ImageModal";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
import { Toaster } from "react-hot-toast";

const ACCESS_KEY = "h1q7CwHDXUlo1_rYGkisihIXhjnTcX-TVWTxY1JdyZ0";

const fetchImages = async (query, page) => {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&page=${page}&per_page=10&client_id=${ACCESS_KEY}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors?.[0] || "Görseller yüklenirken hata oluştu.");
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    throw new Error(
      error.message || "Görseller yüklenirken bir hata oluştu. Lütfen tekrar deneyin."
    );
  }
};

const App = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchImagesWithDelay = useCallback(
    async (searchQuery, pageNum, isInitialLoad = false) => {
      try {
        if (isInitialLoad) {
          setInitialLoading(true);
        } else {
          setLoading(true);
        }
        setError("");

        const newImages = await fetchImages(searchQuery, pageNum);
        
        if (newImages.length === 0) {
          setError("Bu arama için sonuç bulunamadı.");
          return;
        }

        setImages((prev) => (pageNum === 1 ? newImages : [...prev, ...newImages]));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!query) return;

    const timeoutId = setTimeout(() => {
      fetchImagesWithDelay(query, page, page === 1);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [query, page, fetchImagesWithDelay]);

  const handleSearch = (newQuery) => {
    if (newQuery.trim() === "") {
      setError("Lütfen bir arama terimi girin.");
      return;
    }
    setQuery(newQuery);
    setImages([]);
    setPage(1);
  };

  const handleLoadMore = () => setPage((prev) => prev + 1);

  const handleSelectImage = (image) => setSelectedImage(image);

  const handleCloseModal = () => setSelectedImage(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      <SearchBar onSubmit={handleSearch} />
      {error && <ErrorMessage message={error} />}
      {initialLoading ? (
        <Loader isLoading={true} />
      ) : (
        <>
          <ImageGallery images={images} onImageClick={handleSelectImage} />
          {loading && <Loader isLoading={loading} />}
          {images.length > 0 && !loading && (
            <LoadMoreBtn onLoadMore={handleLoadMore} hasImages={true} />
          )}
        </>
      )}
      <ImageModal
        isOpen={!!selectedImage}
        onClose={handleCloseModal}
        image={selectedImage}
      />
    </div>
  );
};

export default App;
