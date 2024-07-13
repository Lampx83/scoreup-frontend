import Button from "@mui/material/Button";
import * as React from "react";
import {keyframes} from "@emotion/react";

function ButtonHighlight(props) {
    const child = props?.children;

    const sh02 = keyframes(`
        from {
            opacity: 0;
            left: 0%;
        }
    
        50% {
            opacity: 1;
        }
    
        to {
            opacity: 0;
            left: 100%;
        }
    `)

    return (
        <Button
            {...props}
            sx={{
                position: "relative",
                paddingLeft: "10px",
                paddingRight: "10px",
                borderRadius: "24px",
                border: "1px solid rgb(61, 106, 255)",
                fontSize: "14px",
                overflow: "hidden",
                boxShadow: "0 0 0 0 transparent",
                webkitTransition: "all 0.2s ease-in",
                mozTransition: "all 0.2s ease-in",
                transition: "all 0.2s ease-in",
                minWidth: "100px",
                ":hover": {
                    backgroundColor: theme => theme.palette.mode === "dark" ? "rgba(80,171,248,0.85)" : "#1A4E8DFF",
                    boxShadow: theme => theme.palette.mode === "dark" ? "0 0 30px 5px rgba(80,171,248,0.85)" : "0 0 30px 5px rgba(26,78,141,0.73)",
                    webkitTransition: "all 0.2s ease-out",
                    mozTransition: "all 0.2s ease-out",
                    transition: "all 0.2s ease-out",
                    color: "white"
                },
                ":hover::before": {
                    webkitAnimation: "sh02 0.5s 0s linear",
                    mozAnimation: "sh02 0.5s 0s linear",
                    animation: `${sh02} 0.5s 0s linear`,
                },
                "::before": {
                    content: '""',
                    display: "block",
                    width: "0px",
                    height: "86%",
                    position: "absolute",
                    top: "7%",
                    left: "0%",
                    opacity: 0,
                    backgroundColor: "#fff",
                    boxShadow: "0 0 50px 30px #fff",
                    webkitTransform: "skewX(-20deg)",
                    mozTransform: "skewX(-20deg)",
                    msTransform: "skewX(-20deg)",
                    oTransform: "skewX(-20deg)",
                    transform: "skewX(-20deg)",
                },
                ":active": {
                    boxShadow: "0 0 0 0 transparent",
                    webkitTransition: "box-shadow 0.2s ease-in",
                    mozTransition: "box-shadow 0.2s ease-in",
                    transition: "box-shadow 0.2s ease-in",
                }
            }}
        >
            {child}
        </Button>
    )
}

export default ButtonHighlight;