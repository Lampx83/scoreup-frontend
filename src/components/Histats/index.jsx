import React from "react";

const Histats = () => {
  React.useEffect(() => {
    window._Hasync = window._Hasync || [];
    window._Hasync.push(["Histats.start", "1,4920998,4,0,0,0,00010000"]);
    window._Hasync.push(["Histats.fasi", "1"]);
    window._Hasync.push(["Histats.track_hits", ""]);

    const hs = document.createElement("script");
    hs.type = "text/javascript";
    hs.async = true;
    hs.src = "https://s10.histats.com/js15_as.js";
    (
      document.getElementsByTagName("head")[0] ||
      document.getElementsByTagName("body")[0]
    ).appendChild(hs);
  }, []);

  // Add a hidden div for Histats counter
  return (
    <div style={{ display: "none" }}>
      <div id="histats_counter"></div>
    </div>
  );
};

export default Histats;
