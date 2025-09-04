import { useDispatch } from "react-redux";
import { Fade, Modal } from "@mui/material";
import Box from "@mui/material/Box";
import "./style.css";
import Button from "@mui/material/Button";
import ContinueWithGoogleButton from "~/components/CustomComponents/ContinueWithGoogleButton/index.jsx";
import MicrosoftButton from "~/components/CustomComponents/MicrosoftLoginButton/index.jsx";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import authService from "~/services/auth.service.js";
import useAuth from "~/hooks/useAuth.jsx";
import useRegisterModal from "~/hooks/useRegisterModal.jsx";
import pushToast from "~/helpers/sonnerToast.js";

function Login() {
  const registerModal = useRegisterModal();
  const auth = useAuth();
  const dispatch = useDispatch();
  const handleClose = () => registerModal.handleClose();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: undefined,
    criteriaMode: "firstError",
  });

  const onSubmit = async (data) => {
    const isSuccess = await authService.register(data);

    if (isSuccess) {
      dispatch(registerModal.handleClose());
      auth.login();
    } else {
      pushToast("Đăng ký thất bại!", "error");
    }
  };

  const onError = (errors, e) => {
    Object.values(errors)
      .reverse()
      .forEach((error) => {
        toast.error(error.message);
      });
  };

  const handleMicrosoftRegisterSuccess = () => {
    registerModal.handleClose();
    auth.login();
  };

  const handleMicrosoftRegisterError = (error) => {
    console.error("Microsoft register error:", error);
    pushToast("Đăng ký Microsoft thất bại, hãy thử lại!", "error");
  };

  return (
    <>
      <Modal
        open={registerModal.open}
        onClose={handleClose}
        aria-labelledby="modal-login"
        aria-describedby="modal-login"
        closeAfterTransition={true}
        // slots={{ backdrop: Backdrop }}
        // slotProps={{
        //   backdrop: {
        //     sx: {
        //       backdropFilter: "blur(5px)",
        //     },
        //     timeout: 500,
        //   },
        // }}
      >
        <Fade in={registerModal.open}>
          <Box
            sx={{
              position: "absolute",
              top: "10%",
              left: "50%",
              transform: "translate(-50%, 0)",
              maxWidth: "400px",
              width: "100%",
              background:
                "linear-gradient(0deg, rgba(255, 255, 255, 1) 0%, rgba(244, 247, 251, 1) 100%)",
              borderRadius: "40px",
              padding: "25px 35px",
              border: "5px solid rgba(255, 255, 255, 1)",
              boxShadow:
                "rgba(133, 189, 215, 0.8784313725) 0px 30px 30px -20px",
              ":focus-visible": {
                outline: "none",
              },
            }}
          >
            <Box
              sx={{
                textAlign: "center",
                fontWeight: 900,
                fontSize: "30px",
                color: "rgb(16, 137, 211)",
              }}
            >
              Đăng ký
            </Box>

            <form
              onSubmit={handleSubmit(onSubmit, onError)}
              className="login-form"
              noValidate={true}
            >
              <input
                className="input-login"
                name="fullName"
                id="fullName"
                placeholder="Họ tên"
                {...register("fullName", {
                  required: "Vui lòng nhập họ tên!",
                })}
              />
              <input
                className="input-login"
                name="email"
                id="email"
                placeholder="Email"
                {...register("email", {
                  required: "Vui lòng nhập email!",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)?neu\.edu\.vn$/,
                    message:
                      "Email không hợp lệ, vui lòng sử dụng email sinh viên NEU!",
                  },
                })}
              />
              {/*<input*/}
              {/*  className="input-login"*/}
              {/*  name="username"*/}
              {/*  id="username"*/}
              {/*  placeholder="Username"*/}
              {/*  {...register("username", {*/}
              {/*    required: "Vui lòng nhập username!",*/}
              {/*    // pattern: {*/}
              {/*    //   value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,*/}
              {/*    //   message: "Email is invalid!"*/}
              {/*    // }*/}
              {/*  })}*/}
              {/*/>*/}
              <input
                className="input-login"
                type="password"
                name="password"
                id="password"
                placeholder="Mật khẩu"
                {...register("password", {
                  required: "Vui lòng nhập mật khẩu!",
                  minLength: {
                    value: 6,
                    message: "Mật khẩu phải có ít nhất 6 ký tự!",
                  },
                })}
              />
              <input
                className="input-login"
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Xác nhận mật khẩu"
                {...register("confirmPassword", {
                  required: "Vui lòng xác nhận lại mật khẩu!",
                  validate: (value) => {
                    if (watch("password") === value) {
                      return true;
                    }
                    return "Mật khẩu không khớp!";
                  },
                })}
              />
              {/*<span className="forgot-password">*/}
              {/*  <a href="#">Forgot Password ?</a>*/}
              {/*</span>*/}
              <Button
                sx={{
                  display: "block",
                  width: "100%",
                  fontWeight: "bold",
                  background:
                    "linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%)",
                  color: "white",
                  padding: "8px",
                  margin: "20px auto",
                  borderRadius: "20px",
                  boxShadow:
                    "rgba(133, 189, 215, 0.8784313725) 0px 20px 10px -15px",
                  border: "none",
                  transition: "all 0.2s ease-in-out",
                  ":hover": {
                    transform: "scale(1.03)",
                    boxShadow:
                      "rgba(133, 189, 215, 0.8784313725) 0px 23px 10px -20px",
                  },
                }}
                type="submit"
              >
                Đăng ký
              </Button>
            </form>
            <div className="social-account-container">
              <span className="title">Hoặc</span>
              <div className="social-accounts" style={{ marginBottom: "15px" }}>
                <MicrosoftButton
                  onSuccess={handleMicrosoftRegisterSuccess}
                  onError={handleMicrosoftRegisterError}
                />
              </div>
            </div>
            {/*<span className="agreement">*/}
            {/*  <a href="#">Chính sách sử dụng</a>*/}
            {/*</span>*/}
          </Box>
        </Fade>
      </Modal>
    </>
  );
}

export default Login;
