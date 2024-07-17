import Button from "@mui/material/Button";

function ButtonHighlight2(props) {
  return (
    <>
      <Button
        {...props}
        sx={{
          padding: "10px 20px",
          borderRadius: "8px",
          fontSize: "17px",
          fontWeight: "500",
          color: "#ffffff80",
          textShadow: "none",
          background: "transparent",
          cursor: "pointer",
          boxShadow: "transparent",
          border: "1px solid #ffffff80",
          transition: "0.5s ease",
          userSelect: "none",
          ':hover': {
            color: "#ffffff",
            background: "#008cff",
            border: "1px solid #008cff",
            // textShadow: "0 0 5px #ffffff, 0 0 20px #ffffff, 0 0 20px #ffffff",
            boxShadow: "0 0 5px #008cff, 0 0 20px #008cff, 0 0 50px #008cff, 0 0 100px #008cff",
          },
          margin: props.margin || "0",
        }}
      >
        {props.children}
      </Button>
    </>
  )
}

export default ButtonHighlight2;