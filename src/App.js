import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, Header, Footer, NovelsByGenre } from "./components/index"
import "./assets/css/layout.scss"

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/genres/:id" element={<NovelsByGenre />} />
          <Route path="/novels/:id" />
          <Route path="/novels/:novel/chapters/:chapter" />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
