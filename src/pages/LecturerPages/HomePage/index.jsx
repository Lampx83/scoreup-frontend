import Box from "@mui/material/Box";
import {
  Pagination,
  Typography
} from "@mui/material";
import headerImg from "~/assets/images/header_userhomepage.png";
import * as React from "react";
import Button from "@mui/material/Button";
import {Add} from "@mui/icons-material";
import LecturerTestCard from "~/components/LecturerComponents/TestCard/index.jsx";
import CreateTest from "~/components/LecturerComponents/CreateTest/index.jsx";

export default function LecturerHomePage() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Box
        sx={{
          width: "100%",
          height: "238px",
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            marginLeft: 10,
            maxWidth: "50%",
            whiteSpace: "wrap",
            color: "white",
          }}
        >
          <Typography variant="h4" fontWeight={700} sx={{}}>
            Xin chào, GV!
          </Typography>
          <Typography variant="p" fontWeight={500} sx={{}}>
            Dưới đây là các bài tập bạn đã tạo cho lớp học của mình
          </Typography>
        </Box>
        <img
          src={headerImg}
          alt="header"
          style={{
            width: "100%",
            height: "238px",
            borderRadius: 15,
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: -1,
          }}
        />
      </Box>
      <Box
        sx={{
          paddingY: 5,
          marginY: 1,
          maxWidth: "100%",
          width: "100%",
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h5" fontWeight={700}>
            Bài tập đã giao
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Add />}
            sx={{
              backgroundColor: "#9BEFE0FF",
              color: "#116B5AFF"
            }}
            onClick={handleClickOpen}
          >
            Tạo bài tập mới
          </Button>
        </Box>
        {/*<Box>
          <Typography variant="body1" sx={{ marginTop: 5 }}>
            Chưa có bài tập nào!
          </Typography>
        </Box>*/}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            marginTop: 2,
            justifyContent: "flex-start"
          }}
        >
          {[1, 2, 3, 4, 5, 1, 2, 3].map((item, index) => (
            <LecturerTestCard key={index}/>
          ))}
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: 5
          }}
        >
          <Pagination count={10} color="primary" />
        </Box>
      </Box>
      <CreateTest open={open} handleClose={handleClose}/>
    </Box>
  );
}