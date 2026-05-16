import { Outlet } from "react-router-dom";
import HeaderComponent from "./components/core/HeaderComponent";
import FooterComponent from "./components/core/FooterComponent";
function App() {
  return (
    <>
      <HeaderComponent />
      <Outlet />
      <FooterComponent />
    </>
  );
}

export default App;
