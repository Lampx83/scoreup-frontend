import Box from "@mui/material/Box";
import {Container, TextField, Typography} from "@mui/material";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import {useForm} from "react-hook-form";
import pushToast from "~/helpers/sonnerToast.js";
import {useNavigate} from "react-router-dom";
import useLoginModal from "~/hooks/useLoginModal.jsx";
import {useEffect} from "react";
import AuthService from "~/services/auth.service.js";

export default function ForgotPassPage() {
  const navigate = useNavigate();
  const loginModal = useLoginModal();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: undefined,
    criteriaMode: "firstError",
  });

  const onSubmit = async (data) => {
    const res = await AuthService.forgotPassword({email: data.email});

    if (res) {
      navigate(`/auth/forgot-password/verify-code`, {
        state: {
          email: data.email
        }
      });
    }
  }

  const onError = (errors, e) => {
    Object.values(errors).forEach((error) => {
      pushToast(error.message, "error");
    });
  }

  return (
    <>
      <Container
        maxWidth={'lg'}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: theme => `calc(100vh - ${theme.app.header.height} - 238px)`,
        }}
      >
        <Box
          sx={{
            padding: 2,
            border: '1px solid #ccc',
            borderRadius: 2,
            boxShadow: 1,
            maxWidth: 600,
            width: '100%',
          }}
        >
          <Typography
            variant={'h6'}
            sx={{
              textAlign: 'left',
              marginBottom: 1,
            }}
          >
              Quên mật khẩu
          </Typography>
          <Divider sx={{marginBottom: 1}}/>
          <Typography
            variant={'body1'}
            sx={{
              textAlign: 'left',
              marginBottom: 1,
            }}
          >
            Bạn quên mật khẩu? Vui lòng nhập địa chỉ email của bạn. Bạn sẽ nhận được mã OTP để tạo mật khẩu mới qua email.
          </Typography>
          <form
            onSubmit={handleSubmit(onSubmit, onError)}
          >
            <TextField
              fullWidth
              label={'Email'}
              variant={'outlined'}
              margin={'normal'}
              required
              sx={{
                marginBottom: 2,
              }}
              {...register('email', {
                required: 'Email không được để trống',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: 'Email không hợp lệ'
                }
              })}
            />
            <Button
              fullWidth
              variant={'contained'}
              color={'primary'}
              type={'submit'}
              sx={{
                backgroundColor: '#1A4E8DFF',
                color: 'white',
                ':hover': {
                  backgroundColor: 'rgba(26,78,141,0.8)',
                  boxShadow: '0 0 10px 0 rgba(26,78,141,0.5)'
                },
              }}
            >
              Nhận mã OTP
            </Button>
          </form>
        </Box>
      </Container>
    </>
  );
}