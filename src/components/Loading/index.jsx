import Box from "@mui/material/Box";
import {Container, useTheme} from "@mui/material";

export default function () {
  const theme = useTheme();

  return (
    <Container
      maxWidth={false}
      sx={{
        height: "100vh",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        transition: "all 0.5s",
        zIndex: 9999,
      }}
    >
      <Box
        sx={{
          width: "65px",
          aspectRatio: "1",
          position: "relative",
          "&:before, &:after": {
            content: '""',
            position: "absolute",
            borderRadius: "50px",
            boxShadow: `0 0 0 3px inset ${theme.palette.primary.main}`,
            animation: "l5 2.5s infinite",
          },
          "&:after": {
            animationDelay: "-1.25s",
            borderRadius: "0",
          },
          "@keyframes l5": {
            "0%": { inset: "0 35px 35px 0" },
            "12.5%": { inset: "0 35px 0 0" },
            "25%": { inset: "35px 35px 0 0" },
            "37.5%": { inset: "35px 0 0 0" },
            "50%": { inset: "35px 0 0 35px" },
            "62.5%": { inset: "0 0 0 35px" },
            "75%": { inset: "0 0 35px 35px" },
            "87.5%": { inset: "0 0 35px 0" },
            "100%": { inset: "0 35px 35px 0" },
          },
        }}
      ></Box>
    </Container>
  )
}