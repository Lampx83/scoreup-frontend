import * as React from "react";
import Box from "@mui/material/Box";
import headerImg from "~/assets/images/header_userhomepage.png";
import {Container, Icon, Typography, useTheme} from "@mui/material";
import useSideBar from "~/hooks/useSideBar.jsx";
import SingleQuestion from "~/components/Question/SingleQuestion/index.jsx";
import SetQuestion from "~/components/Question/SetQuestion/index.jsx";


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
        <SingleQuestion
          question={"Câu 1: Tại sao bạn chọn học tại trường Công nghệ - NEU?"}
          options={[
            "A. Vì trường có chất lượng đào tạo tốt",
            "B. Vì trường có chất lượng đào tạo tốt",
            "C. Vì trường có chất lượng đào tạo tốt",
            "D. Vì trường có chất lượng đào tạo tốt"
          ]}
        />
        {/*2*/}
        <SingleQuestion
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
        <SingleQuestion
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
      {/*  Set question*/}
        <SetQuestion
          context={"Questions refer to the following movie review.<p><b>Hind Sight</b><br><i>Valley Cinema: </i>11, 1:45, 4, 6:30, 9<br>A remake of the murdered French filmmaker Claude Chemmert's 1987 drama of the same name, 'Hind Sight,' directed by Stephen Toussant (who ought to get behind the camera more often), gets a lot of mileage out of the confident and wistful performances of Susan Evans and Sean Robinson as Jan and Dave, a married couple who meet up for various rendezvous in Dave's restaurant while engaged in different role-playing fantasies. <br>Gradually, we learn that the two are hiding and flirting in other personas so they can reconnect after a horrific experience, though by the time that would-be revelation comes, the movie - which had to wait two years to find a distributor - is about more than secrets. It's about watching two always-fine actors do a lot with very little.<p>-- John Hartzell"}
          questions={[
            {
              question: "Câu 1: Tại sao bạn chọn học tại trường Công nghệ - NEU?",
              options: [
                "A. Vì trường có chất lượng đào tạo tốt",
                "B. Vì trường có chất lượng đào tạo tốt",
                "C. Vì trường có chất lượng đào tạo tốt",
                "D. Vì trường có chất lượng đào tạo tốt"
              ]
            },
            {
              question: "Câu 2: Tại sao bạn chọn học tại trường Công nghệ - NEU?",
              options: [
                "A. Vì trường có chất lượng đào tạo tốt",
                "B. Vì trường có chất lượng đào tạo tốt",
                "C. Vì trường có chất lượng đào tạo tốt",
                "D. Vì trường có chất lượng đào tạo tốt"
              ],
              code: "#include <iostream>\n" +
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
                "}"
            },
            {
              question: "Câu 3: Tại sao bạn chọn học tại trường Công nghệ - NEU?",
              options: [
                "A. Vì trường có chất lượng đào tạo tốt",
                "B. Vì trường có chất lượng đào tạo tốt",
                "C. Vì trường có chất lượng đào tạo tốt",
                "D. Vì trường có chất lượng đào tạo tốt"
              ],
              image: "https://www.w3schools.com/w3css/img_lights.jpg",
              audio: "https://scoreup.whoisduyviet.id.vn/media/toeic/mp3/Part1/part1_1.mp3"
            }
          ]}
        />
      </Box>
    </Container>
  );
}
