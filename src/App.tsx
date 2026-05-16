import { Outlet } from "react-router-dom";
import HeaderComponent from "./components/HeaderComponent";
import FooterComponent from "./components/FooterComponent";
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
