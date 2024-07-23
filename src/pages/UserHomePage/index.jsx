import * as React from "react";
import Box from "@mui/material/Box";
import headerImg from "~/assets/images/header_userhomepage.png";
import {Container, Icon, Typography, useTheme} from "@mui/material";
import useSideBar from "~/hooks/useSideBar.jsx";
import QuestionVariant1 from "~/components/Question/QuestionVariant1/index.jsx";


export default function UserHomePage() {
  const theme = useTheme();
  const {open: openSideBar} = useSideBar();

  return (
    <Container maxWidth={'lg'}
      sx={{
        margin: "auto",
      }}
    >
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
            color: "white"
          }}
        >
          <Typography variant="h4" fontWeight={700} sx={{}}>
            Xin chào, Duy Việt!
          </Typography>
          <Typography variant="p" fontWeight={500} sx={{}}>
            Lướt xuống để xem các bài tập được gợi ý riêng cho bạn.
          </Typography>
        </Box>
        <img src={headerImg} alt="header" style={{
          width: "100%",
          height: "238px",
          borderRadius: 15,
          objectFit: "cover",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: -1
        }}/>
      </Box>

      {/*questions container*/}
      <Box
        sx={{
          paddingY: 5,
          marginY: 5,
        }}
      >
        {/*1*/}
        <QuestionVariant1
          question={"Câu 1: Tại sao bạn chọn học tại trường Công nghệ - NEU?"}
          options={[
            "A. Vì trường có chất lượng đào tạo tốt",
            "B. Vì trường có chất lượng đào tạo tốt",
            "C. Vì trường có chất lượng đào tạo tốt",
            "D. Vì trường có chất lượng đào tạo tốt"
          ]}
        />
        {/*2*/}
        <QuestionVariant1
          question={"Câu 1: Tại sao bạn chọn học tại trường Công nghệ - NEU?"}
          options={[
            "A. Vì trường có chất lượng đào tạo tốt",
            "B. Vì trường có chất lượng đào tạo tốt",
            "C. Vì trường có chất lượng đào tạo tốt",
            "D. Vì trường có chất lượng đào tạo tốt"
          ]}
          code={"#include <iostream>\n" +
            "using namespace std;\n" +
            "\n" +
            "int main() {\n" +
            "\n" +
            "  int first_number, second_number, sum;\n" +
            "    \n" +
            "  cout << \"Enter two integers: \";\n" +
            "  cin >> first_number >> second_number;\n" +
            "\n" +
            "  // sum of two numbers in stored in variable sumOfTwoNumbers\n" +
            "  sum = first_number + second_number;\n" +
            "\n" +
            "  // prints sum \n" +
            "  cout << first_number << \" + \" <<  second_number << \" = \" << sum;     \n" +
            "\n" +
            "  return 0;\n" +
            "}"}
        />
        {/*3*/}
        <QuestionVariant1
          question={"Câu 1: Tại sao bạn chọn học tại trường Công nghệ - NEU?"}
          options={[
            "A. Vì trường có chất lượng đào tạo tốt",
            "B. Vì trường có chất lượng đào tạo tốt",
            "C. Vì trường có chất lượng đào tạo tốt",
            "D. Vì trường có chất lượng đào tạo tốt"
          ]}
          image={"https://www.w3schools.com/w3css/img_lights.jpg"}
          audio={"https://scoreup.whoisduyviet.id.vn/media/toeic/mp3/Part1/part1_1.mp3"}
        />
      </Box>
    </Container>
  );
}
