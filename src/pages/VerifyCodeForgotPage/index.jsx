import Button from "@mui/material/Button";
import {Container, FormHelperText, TextField, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import {useLocation, useNavigate} from "react-router-dom";
import { MuiOtpInput } from 'mui-one-time-password-input'
import {useState} from "react";
import {Controller, useForm} from "react-hook-form";
import pushToast from "~/helpers/sonnerToast.js";
import AuthService from "~/services/auth.service.js";

export default function VerifyCodeForgotPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: undefined,
    criteriaMode: "firstError",
  });

  const handleChange = (otp) => {
    setOtp(otp);
    setValue('otp', otp);
  }

  const onSubmit = async (data) => {

    const res = await AuthService.verifyOtpForgotPassword({
      email: data.email,
      otp: data.otp
    })

    if (res) {
      navigate(`/auth/forgot-password/reset-password`, {
        state: {
          email: location.state?.email,
          token: res.metadata.token
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
            marginBottom: 1,
          }}
        >
          Xác thực mã
        </Typography>
        <Typography
          variant={'body1'}
          sx={{
            marginBottom: 1,
          }}
        >
          Mã xác thực đã được gửi đến email của bạn. Vui lòng kiểm tra email và nhập mã xác thực vào ô bên dưới.
          Hãy kiểm tra cả hộp thư spam hoặc thư rác (Nếu email xác thực nằm trong hộp thư rác, vui lòng báo cáo rằng đây không phải thư rác, thanks u ❤️!).
        </Typography>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
          component={'form'}
          onSubmit={handleSubmit(onSubmit, onError)}
        >
          <TextField
            variant={'outlined'}
            size={"small"}
            label={'Email'}
            required
            sx={{
              width: '100%',
              marginBottom: 1,
              marginTop: 1,
            }}
            defaultValue={location.state?.email}
            disabled
            {...register('email', {
              value: location.state?.email,
              required: 'Email không được để trống',
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <Controller
            name={'otp'}
            control={control}
            rules={{
              validate: (value) => {
                return !!value || 'OTP không được để trống';
              }
            }}
            render={({field, fieldState}) => (
              <Box
                sx={{
                  marginBottom: 2,
                  marginTop: 1,
                }}
              >
                <MuiOtpInput
                  {...field}
                  value={otp}
                  onChange={handleChange}
                  length={4}
                  autoFocus
                  validateChar={(value) => {
                    return value.match(/[0-9]/) !== null;
                  }}
                  TextFieldsProps={{
                    variant: 'outlined',
                    sx: {
                      marginTop: 1,
                    },
                    placeholder: '-',
                  }}
                />
                {fieldState.invalid ? (
                  <FormHelperText error>OTP invalid</FormHelperText>
                ) : null}
              </Box>
            )}
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
            Xác thực
          </Button>
        </Box>
      </Box>
    </Container>
  )
}