import React from "react";
import { Button } from "@mui/material";
import microsoftService from "~/services/microsoft.service.js";

const MicrosoftButton = ({ onSuccess, onError, disabled = false }) => {
  const handleMicrosoftLogin = async () => {
    try {
      const success = await microsoftService.initiateLogin();
      if (success && onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Microsoft login error:", error);
      if (onError) {
        onError(error);
      }
    } 
  };

  return (
    <Button
      onClick={handleMicrosoftLogin}
      disabled={disabled}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        padding: "12px 16px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        backgroundColor: "#fff",
        color: "#333",
        fontSize: "14px",
        fontWeight: "500",
        textTransform: "none",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          backgroundColor: "#f8f9fa",
          boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
          transform: "translateY(-1px)",
        },
        "&:disabled": {
          backgroundColor: "#f5f5f5",
          color: "#999",
          cursor: "not-allowed",
        },
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 21 21"
        style={{ marginRight: "8px" }}
      >
        <rect x="1" y="1" width="9" height="9" fill="#f25022" />
        <rect x="12" y="1" width="9" height="9" fill="#00a4ef" />
        <rect x="1" y="12" width="9" height="9" fill="#ffb900" />
        <rect x="12" y="12" width="9" height="9" fill="#7fba00" />
      </svg>
      Đăng nhập với Microsoft (NEU)
    </Button>
  );
};

export default MicrosoftButton;
