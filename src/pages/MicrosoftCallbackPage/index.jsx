import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import microsoftService from "~/services/microsoft.service.js";
import useAuth from "~/hooks/useAuth.jsx";
import pushToast from "~/helpers/sonnerToast.js";
import HeroSection from "~/components/HeroSection/index.jsx";
import Footer from "~/components/Footer/index.jsx";
import LecturerHeader from "~/components/LecturerComponents/Header/index.jsx";
import Histats from "~/components/Histats/index.jsx";

const MicrosoftCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const auth = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setIsProcessing(true);

        // Handle the Microsoft OAuth callback
        const success = await microsoftService.handleCallback(searchParams);

        if (success) {
          // Login successful, update auth state
          auth.login();
          pushToast("Đăng nhập Microsoft thành công!", "success");

          // Redirect to dashboard or intended page
          const intendedPath =
            sessionStorage.getItem("intended_path") || "/dashboard";
          sessionStorage.removeItem("intended_path");
          navigate(intendedPath, { replace: true });
        } else {
          // Login failed, redirect to home page
          pushToast("Đăng nhập Microsoft thất bại!", "error");
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("Error in Microsoft callback:", error);
        pushToast("Có lỗi xảy ra trong quá trình đăng nhập!", "error");
        navigate("/", { replace: true });
      } finally {
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [searchParams, navigate, auth]);

  return (
    <>
      <Histats />
      <LecturerHeader />
      <HeroSection />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <CircularProgress size={60} />
        <Typography
          variant="h6"
          sx={{
            mt: 2,
            color: "#666",
            textAlign: "center",
          }}
        >
          {isProcessing
            ? "Đang xử lý đăng nhập Microsoft..."
            : "Hoàn tất đăng nhập"}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mt: 1,
            color: "#999",
            textAlign: "center",
          }}
        >
          Vui lòng đợi trong giây lát
        </Typography>
      </Box>
      <Footer />
    </>
  );
};

export default MicrosoftCallbackPage;
