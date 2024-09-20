import {FormControl, FormHelperText, InputAdornment, Select, TextField, Typography} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import {useEffect, useState} from "react";
import schoolData from "~/constant/schoolData.js";
import {MdAlternateEmail, MdClass} from "react-icons/md";
import cookies from "~/utils/cookies.js";

function SelectClass({register, errors}) {
  const userInfo = cookies.get("user", {path: "/"});
  const [school, setSchool] = useState(userInfo.school || "");
  const [major, setMajor] = useState(userInfo.major || "");
  const [classroom, setClassroom] = useState(userInfo.className || "");

  const majorData = schoolData.find(item => item.name === school)?.departments || [];

  const handleChangeSchool = (event) => {
    setSchool(event.target.value);
  };

  const handleChangeMajor = (event) => {
    setMajor(event.target.value);
  }

  return (
    <>
      <Typography variant={"h6"} fontSize={18} fontWeight={600} sx={{marginTop: 4}}>
        Khoa/Viện/Trường
      </Typography>

      <FormControl sx={{ minWidth: 120 }}>
        <Select
          value={school}
          onChange={handleChangeSchool}
          displayEmpty
          inputProps={register("school", {
            required: "Vui lòng chọn khoa/viện/trường"
          })}
          sx={{
            height: 40,
            fontSize: 14,
            backgroundColor: "#F5F5F5",
            borderRadius: 2,
          }}
        >
          <MenuItem value={''}>
            <em>Chọn khoa/viện/trường</em>
          </MenuItem>
          {schoolData.map((item, index) => (
            <MenuItem key={index} value={item.name}>{item.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Typography variant={"h6"} fontSize={18} fontWeight={600} sx={{marginTop: 4}}>
        Ngành
      </Typography>

      <FormControl sx={{ minWidth: 120 }}>
        <Select
          value={major}
          onChange={handleChangeMajor}
          displayEmpty
          inputProps={register("major", {
            required: "Vui lòng chọn ngành"
          })}
          sx={{
            height: 40,
            fontSize: 14,
            backgroundColor: "#F5F5F5",
            borderRadius: 2,
          }}
        >
          <MenuItem value={''}>
            <em>Chọn ngành</em>
          </MenuItem>
          {majorData.map((item, index) => (
            <MenuItem key={index} value={item.name}>{item.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/*<Typography variant={"h6"} fontSize={18} fontWeight={600} sx={{marginTop: 4}}>*/}
      {/*  Lớp chuyên ngành (64A, 64B, 64C,...)*/}
      {/*</Typography>*/}

      {/*<TextField*/}
      {/*  fullWidth*/}
      {/*  size="small"*/}
      {/*  variant={"outlined"}*/}
      {/*  defaultValue={userInfo.className}*/}
      {/*  {...register("className", {*/}
      {/*    required: "Vui lòng nhập lớp"*/}
      {/*  })}*/}
      {/*  error={!!errors.className}*/}
      {/*  helperText={errors.className && errors.className.message}*/}
      {/*  placeholder={"Nhập lớp"}*/}
      {/*  InputProps={{*/}
      {/*    sx: {*/}
      {/*      borderRadius: 2,*/}
      {/*      backgroundColor: "#f2f2f2",*/}
      {/*      border: "none"*/}
      {/*    },*/}
      {/*    startAdornment: (*/}
      {/*      <InputAdornment position={"start"}>*/}
      {/*        <MdClass/>*/}
      {/*      </InputAdornment>*/}
      {/*    )*/}
      {/*  }}*/}
      {/*/>*/}
    </>
  )
}

export default SelectClass;