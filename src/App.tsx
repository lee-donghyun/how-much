import { Route, Routes } from "react-router-dom";
import Navigation from "./components/Navigation";
import CalenderPage from "./pages/Calender";

function App() {
  return (
    <Routes>
      <Route element={<Navigation />}>
        <Route index element={<CalenderPage />} />
      </Route>
    </Routes>
  );
}

export default App;
