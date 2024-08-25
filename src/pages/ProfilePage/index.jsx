import useActiveTab from "~/hooks/useActiveTab.jsx";
import {
  Container,
  FormControl, FormHelperText,
  InputAdornment,
  InputLabel,
  Select,
  TextField,
  Typography,
  useTheme
} from "@mui/material";
import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import cookies from "~/utils/cookies.js";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import {styled} from "@mui/material/styles";
import pushToast from "~/helpers/sonnerToast.js";
import {Controller, useForm} from "react-hook-form";
import authService from "~/services/auth.service.js";
import {toast} from "sonner";
import { IoPersonOutline } from "react-icons/io5";
import {MdAlternateEmail, MdClass} from "react-icons/md";
import {FiPhone} from "react-icons/fi";
import {FaSchool} from "react-icons/fa6";
import MenuItem from "@mui/material/MenuItem";
import SelectClass from "~/pages/ProfilePage/SelectClass/index.jsx";
import {LiaBirthdayCakeSolid} from "react-icons/lia";
import {updateUser} from "~/services/user.service.js";
import {moment} from "~/utils/moment.js";

function SelectGender({register, errors}) {
  const userInfo = cookies.get("user", {path: "/"});
  const [gender, setGender] = useState(userInfo.gender);

  const handleChangeGender = (event) => {
    setGender(event.target.value);
  }

  return (
    <>
      <Typography variant={"h6"} fontSize={18} fontWeight={600} sx={{marginTop: 4}}>
        Giới tính
      </Typography>

      <FormControl sx={{ minWidth: 120 }}>
        <Select
          value={gender}
          onChange={handleChangeGender}
          displayEmpty
          inputProps={register("gender")}
          sx={{
            height: 40,
            fontSize: 14,
            backgroundColor: "#F5F5F5",
            borderRadius: 2,
          }}
        >
          <MenuItem value={''}>
            <em>Chọn giới tính</em>
          </MenuItem>
          <MenuItem value={"Nam"}>Nam</MenuItem>
          <MenuItem value={"Nữ"}>Nữ</MenuItem>
          <MenuItem value={"Khác"}>Khác</MenuItem>
        </Select>
      </FormControl>
    </>
  )
}

function ProfilePage() {
  const { updateActiveTab } = useActiveTab();
  const theme = useTheme();
  const userInfo = (cookies.get("user", {path: "/"}));
  const [uploadedFile, setUploadedFile] = useState(userInfo.avatar);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: undefined,
    criteriaMode: "firstError",
  });

  const {
    register: registerChangePass,
    handleSubmit: handleSubmitChangePass,
    formState: { errors: errorsChangePass },
    control: controlChangePass
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: undefined,
    criteriaMode: "firstError",
  })

  const onSubmit = async (data) => {
    try {
      const res = await updateUser(data);
      pushToast("Cập nhật thông tin thành công!", "success");
    } catch (e) {
      const msg = e.response.data.message;
      pushToast(msg || "Cập nhật thông tin thất bại!", "error");
    }
  };

  const onError = (errors, e) => {
    Object.values(errors).forEach((error) => {
      toast.error(error.message);
    });
  }

  const onSubmitChangePass = async (data) => {
    try {
      if (data.newPassword !== data.confirmPassword) {
        pushToast("Mật khẩu xác nhận không khớp!", "error");
        return;
      }

      const res = await updateUser(data);
      pushToast("Cập nhật thông tin thành công!", "success");
    } catch (e) {
      const msg = e.response.data.message;
      pushToast(msg || "Cập nhật thông tin thất bại!", "error");
    }
  }

  useEffect(() => {
    updateActiveTab("profile");
  }, []);

  const handleChangeAvatar = (e) => {
    try {
      const file = e.target.files[0];
      setUploadedFile(URL.createObjectURL(file));
    } catch (e) {}
  }

  const handleDeleteAvatar = () => {
    setUploadedFile(userInfo.avatar);
  }

  return(
    <>
      <Container
        maxWidth={false}
        sx={{
          margin: "auto",
          width: "100%",
          position: "relative",
          maxWidth: theme.breakpoints.values.lg
        }}
      >
        <Box
          sx={{
            border: "1px solid #e0e0e0",
            padding: "36px",
            borderRadius: "10px",
          }}
          component={"form"}
          onSubmit={handleSubmit(onSubmit, onError)}
        >
          <Typography variant="h4" fontWeight={700} sx={{}}>
            Thông tin cá nhân
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              marginTop: "20px",
              "& > *": {
                marginBottom: "10px"
              }
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 2,
                width: "fit-content",
                flexWrap: "wrap",
              }}
            >
              <Typography
                variant="h6"
                fontWeight={600}
                fontSize={18}
                sx={{
                  flexBasis: "100%",
                }}
              >
                Ảnh đại diện
              </Typography>
              <Box
                sx={{
                  width: "150px",
                  height: "150px",
                }}
              >
                <Avatar
                  src={uploadedFile}
                  alt="avatar"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "16px",
                    objectFit: "cover"
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={500}
                  fontSize={18}
                >
                  Tải ảnh lên
                </Typography>
                <Typography
                  variant="p"
                  fontWeight={500}
                  fontSize={14}
                >
                  Chỉ chấp nhận tệp định dạng PNG, JPG, JPEG
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                  }}
                >
                  <Button
                    component="label"
                    sx={{
                      border: "1px solid #1A4E8DFF",
                      borderRadius: 5,
                      width: "fit-content",
                      padding: "5px 10px",
                      color: "#1A4E8DFF",
                      marginTop: 2,
                      "&:hover": {
                        backgroundColor: "#1A4E8DFF",
                        color: "#fff"
                      }
                    }}
                  >
                    {/*<VisuallyHiddenInput*/}
                    {/*  onChange={handleChangeAvatar}*/}
                    {/*  type="file"*/}
                    {/*  accept={".png,.jpg,.jpeg"}*/}
                    {/*/>*/}
                    <Controller
                      name="avatar"
                      control={control}
                      render={({ field }) => (
                        <input
                          type="file"
                          accept=".png,.jpg,.jpeg"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            handleChangeAvatar(e);
                            field.onChange(e.target.files[0]);
                          }}
                        />
                      )}
                    />
                    <Typography
                      variant="p"
                      fontWeight={500}
                      fontSize={14}
                    >
                      Chọn ảnh
                    </Typography>
                  </Button>
                  <Button
                    sx={{
                      borderRadius: 5,
                      width: "fit-content",
                      padding: "5px 10px",
                      marginTop: 2,
                      color: "#3C3D37",
                      "&:hover": {
                        backgroundColor: "#3C3D37",
                        color: "#fff"
                      }
                    }}
                    onClick={handleDeleteAvatar}
                  >
                    <Typography
                      variant="p"
                      fontWeight={500}
                      fontSize={14}
                    >
                      Xóa ảnh
                    </Typography>
                  </Button>
                </Box>
              </Box>
            </Box>

            <Typography variant={"h6"} fontSize={18} fontWeight={600} sx={{marginTop: 4}}>
              Họ và tên
            </Typography>

            <TextField
              fullWidth
              size="small"
              variant={"outlined"}
              defaultValue={userInfo.fullName}
              {...register("fullName", {
                required: "Vui lòng nhập họ và tên"
              })}
              error={!!errors.fullName}
              helperText={errors.fullName && errors.fullName.message}
              placeholder={"Nhập họ và tên"}
              InputProps={{
                sx: {
                  borderRadius: 2,
                  backgroundColor: "#f2f2f2",
                  border: "none"
                },
                startAdornment: (
                  <InputAdornment position={"start"}>
                    <IoPersonOutline/>
                  </InputAdornment>
                )
              }}
            />

            <Typography variant={"h6"} fontSize={18} fontWeight={600} sx={{marginTop: 4}}>
              Email
            </Typography>

            <TextField
              fullWidth
              size="small"
              variant={"outlined"}
              defaultValue={userInfo.email}
              {...register("email", {
                required: "Vui lòng nhập email"
              })}
              error={!!errors.email}
              helperText={errors.email && errors.email.message}
              placeholder={"Nhập email"}
              InputProps={{
                sx: {
                  borderRadius: 2,
                  backgroundColor: "#f2f2f2",
                  border: "none"
                },
                startAdornment: (
                  <InputAdornment position={"start"}>
                    <MdAlternateEmail/>
                  </InputAdornment>
                )
              }}
            />

            <SelectClass register={register} errors={errors}/>

            <SelectGender register={register} errors={errors}/>

            <Typography variant={"h6"} fontSize={18} fontWeight={600} sx={{marginTop: 4}}>
              Ngày sinh
            </Typography>

            <TextField
              fullWidth
              size="small"
              type={"date"}
              variant={"outlined"}
              defaultValue={moment(userInfo.birth).format("YYYY-MM-DD")}
              {...register("birth")}
              error={!!errors.email}
              helperText={errors.email && errors.email.message}
              placeholder={"Nhập ngày sinh"}
              InputProps={{
                sx: {
                  borderRadius: 2,
                  backgroundColor: "#f2f2f2",
                  border: "none"
                },
                startAdornment: (
                  <InputAdornment position={"start"}>
                    <LiaBirthdayCakeSolid/>
                  </InputAdornment>
                )
              }}
            />

          </Box>


          <Button
            type={"submit"}
            sx={{
              border: "1px solid #007bff",
              borderRadius: 5,
              width: "fit-content",
              padding: "5px 10px",
              marginRight: 2,
              color: "#fff",
              backgroundColor: "#1A4E8DFF",
              marginTop: 2,
              "&:hover": {
                backgroundColor: "rgba(26,78,141,0.7)",
                color: "#fff"
              }
            }}
          >
            <Typography
              variant="p"
              fontWeight={500}
              fontSize={14}
            >
              Lưu thay đổi
            </Typography>
          </Button>

          {/*<Button
            type={"reset"}
            sx={{
              border: "1px solid #007bff",
              borderRadius: 5,
              width: "fit-content",
              padding: "5px 10px",
              color: "#fff",
              backgroundColor: "#3C3D37",
              marginTop: 2,
              "&:hover": {
                backgroundColor: "#3C3D37",
                color: "#fff"
              }
            }}
          >
            <Typography
              variant="p"
              fontWeight={500}
              fontSize={14}
            >
              Hủy
            </Typography>
          </Button>*/}

        </Box>

        <Box
          sx={{
            border: "1px solid #e0e0e0",
            padding: "36px",
            borderRadius: "10px",
            marginTop: "20px"
          }}
          component={"form"}
          onSubmit={handleSubmitChangePass(onSubmitChangePass, onError)}
        >
          <Typography variant="h4" fontWeight={700} sx={{}}>
            Đổi mật khẩu
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              marginTop: "20px",
              "& > *": {
                marginBottom: "10px"
              }
            }}
          >
            <Typography variant={"h6"} fontSize={18} fontWeight={600} sx={{marginTop: 4}}>
              Mật khẩu cũ
            </Typography>

            <TextField
              fullWidth
              size="small"
              variant={"outlined"}
              type={"password"}
              {...registerChangePass("oldPassword", {
                required: "Vui lòng nhập mật khẩu cũ"
              })}
              error={!!errorsChangePass.oldPassword}
              helperText={errorsChangePass.oldPassword && errorsChangePass.oldPassword.message}
              placeholder={"Nhập mật khẩu cũ"}
              InputProps={{
                sx: {
                  borderRadius: 2,
                  backgroundColor: "#f2f2f2",
                  border: "none"
                }
              }}
            />

            <Typography variant={"h6"} fontSize={18} fontWeight={600} sx={{marginTop: 4}}>
              Mật khẩu mới
            </Typography>

            <TextField
              fullWidth
              size="small"
              variant={"outlined"}
              type={"password"}
              {...registerChangePass("newPassword", {
                required: "Vui lòng nhập mật khẩu mới"
              })}
              error={!!errorsChangePass.newPassword}
              helperText={errorsChangePass.newPassword && errorsChangePass.newPassword.message}
              placeholder={"Nhập mật khẩu mới"}
              InputProps={{
                sx: {
                  borderRadius: 2,
                  backgroundColor: "#f2f2f2",
                  border: "none"
                }
              }}
            />

            <Typography variant={"h6"} fontSize={18} fontWeight={600} sx={{marginTop: 4}}>
              Xác nhận mật khẩu mới
            </Typography>

            <TextField
              fullWidth
              size="small"
              variant={"outlined"}
              type={"password"}
              {...registerChangePass("confirmPassword", {
                required: "Vui lòng xác nhận mật khẩu mới"
              })}
              error={!!errorsChangePass.confirmPassword}
              helperText={errorsChangePass.confirmPassword && errorsChangePass.confirmPassword.message}
              placeholder={"Xác nhận mật khẩu mới"}
              InputProps={{
                sx: {
                  borderRadius: 2,
                  backgroundColor: "#f2f2f2",
                  border: "none"
                }
              }}
            />

          </Box>

          <Button
            type={"submit"}
            sx={{
              border: "1px solid #007bff",
              borderRadius: 5,
              width: "fit-content",
              padding: "5px 10px",
              marginRight: 2,
              color: "#fff",
              backgroundColor: "#1A4E8DFF",
              marginTop: 2,
              "&:hover": {
                backgroundColor: "rgba(26,78,141,0.7)",
                color: "#fff"
              }
            }}
          >
            <Typography
              variant="p"
              fontWeight={500}
              fontSize={14}
            >
              Lưu thay đổi
            </Typography>
          </Button>

          {/*<Button
            type={"reset"}
            sx={{
              border: "1px solid #007bff",
              borderRadius: 5,
              width: "fit-content",
              padding: "5px 10px",
              color: "#fff",
              backgroundColor: "#3C3D37",
              marginTop: 2,
              "&:hover": {
                backgroundColor: "#3C3D37",
                color: "#fff"
              }
            }}
          >
            <Typography
              variant="p"
              fontWeight={500}
              fontSize={14}
            >
              Hủy
            </Typography>
          </Button>*/}
        </Box>
      </Container>
    </>
  )
}

export default ProfilePage;