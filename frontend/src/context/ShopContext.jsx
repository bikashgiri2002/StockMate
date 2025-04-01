import { createContext, useState, useEffect } from "react";

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [shop, setShop] = useState(null);

  // Load shop data from localStorage on mount
  useEffect(() => {
    const storedShop = localStorage.getItem("shop");
    if (storedShop) {
      setShop(JSON.parse(storedShop));
    }
  }, []);

  // Function to log in a shop (store token and shop info)
  const loginShop = (shopData, token) => {
    localStorage.setItem("shop", JSON.stringify(shopData));
    localStorage.setItem("token", token);
    setShop(shopData);
  };

  // Function to log out the shop
  const logoutShop = () => {
    localStorage.removeItem("shop");
    localStorage.removeItem("token");
    setShop(null);
  };

  return (
    <ShopContext.Provider value={{ shop, loginShop, logoutShop }}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContext;
