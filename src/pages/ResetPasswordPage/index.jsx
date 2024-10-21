import Button from "@mui/material/Button";
import {Container, FormHelperText, TextField, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import {useLocation, useNavigate} from "react-router-dom";
import { MuiOtpInput } from 'mui-one-time-password-input'
import {useState} from "react";
import {Controller, useForm} from "react-hook-form";
import pushToast from "~/helpers/sonnerToast.js";
import AuthService from "~/services/auth.service.js";

export default function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    getValues
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: undefined,
    criteriaMode: "firstError",
  });

  const onSubmit = async (data) => {
    console.log({ ...data, token: location.state?.token, email: location.state?.email });
    const res = await AuthService.resetPassword({
      email: location.state?.email,
      password: data.password,
      token: location.state?.token
    })
    if (res) {
      pushToast("Đổi mật khẩu thành công", "success");
      navigate('/');
    }
  }

  const onError = (errors, e) => {
    Object.values(errors).forEach((error) => {
      pushToast(error.message, "error");
    });
  }

  return (
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
          Đổi mật khẩu
        </Typography>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <TextField
            label="Mật khẩu mới"
            type="password"
            fullWidth
            margin="normal"
            {...register('password', {
              required: 'Mật khẩu không được để trống',
              minLength: {
                value: 6,
                message: 'Mật khẩu phải có ít nhất 6 kí tự'
              }
            })}
            error={errors.password ? true : false}
            helperText={errors.password ? errors.password.message : ''}
          />
          <TextField
            label="Nhập lại mật khẩu"
            type="password"
            fullWidth
            margin="normal"
            {...register('confirmPassword', {
              required: 'Mật khẩu không được để trống',
              validate: (value) => value === getValues('password') || 'Mật khẩu không khớp'
            })}
            error={errors.confirmPassword ? true : false}
            helperText={errors.confirmPassword ? errors.confirmPassword.message : ''}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              backgroundColor: '#1A4E8DFF',
              color: 'white',
              ':hover': {
                backgroundColor: 'rgba(26,78,141,0.8)',
                boxShadow: '0 0 10px 0 rgba(26,78,141,0.5)'
              },
              marginTop: 2
            }}
          >
            Đổi mật khẩu
          </Button>
        </form>
      </Box>
    </Container>
  );
}