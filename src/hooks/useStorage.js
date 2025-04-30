import { useState } from "react";

export function useStorage(key, defaultValue) {
  const getStoredValue = () => {
    const item = localStorage.getItem(key);
    if (!item || item === "undefined") {
      return defaultValue;
    } else {
      return JSON.parse(item);
    }
  };

  const [value, setValue] = useState(getStoredValue);

  const setStoredValue = (newValue) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, setStoredValue];
}
