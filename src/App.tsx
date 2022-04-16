import { Route, Routes } from "react-router-dom";
import Navigation from "./components/Navigation";
import CalenderPage from "./pages/Calender";
import StasticsPage from "./pages/Stastics";

function App() {
  return (
    <Routes>
      <Route element={<Navigation />}>
        <Route index element={<CalenderPage />} />
        <Route path="/stastics" element={<StasticsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
