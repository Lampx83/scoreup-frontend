import React, { createContext, useContext, useState } from "react";
const Ctx = createContext(null);

export function ExamPaletteProvider({ children }) {
  const [palette, setPalette] = useState(null);
  return (
    <Ctx.Provider value={{ palette, setPalette }}>{children}</Ctx.Provider>
  );
}

export function useExamPalette() {
  const ctx = useContext(Ctx);
  return ctx?.palette;
}

export function useSetExamPalette() {
  const ctx = useContext(Ctx);
  return ctx?.setPalette;
}
