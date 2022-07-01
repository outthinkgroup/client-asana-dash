import React from "react";

export const AuthContext = React.createContext();

export default function AuthContextProvider({ children }) {
  const [isUserSignedIn, setIsUserSignedIn] = React.useState(false);
  React.useEffect(() => {
    if (localStorage.getItem("identity")) {
      const identity = JSON.parse(localStorage.getItem("identity"));
      const name = identity.user.user_metadata.full_name;
      setIsUserSignedIn(Boolean(name));
    }
  }, []);
  return (
    <AuthContext.Provider value={{ isUserSignedIn, setIsUserSignedIn }}>
      {children}
    </AuthContext.Provider>
  );
}
