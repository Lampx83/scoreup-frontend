import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import useRecommendModal from "~/hooks/useModalRecommend.jsx";
import Box from "@mui/material/Box";
import {Icon, Typography} from "@mui/material";
import fullCat from "~/assets/images/fullbody.svg";
import sadCat from "~/assets/images/sad.svg";
import {parseQuestion} from "~/helpers/parseNotionResponseToObject.js";
import QuestionCard from "~/components/Question/QuestionCard/index.jsx";
import {IoCloseCircleOutline} from "react-icons/io5";
import {useEffect, useState} from "react";


export default function RecommendModal() {
  const {open, handleClose, handleOpen} = useRecommendModal();
  const [isTrue, setIsTrue] = useState("not-selected");

  const handleContinue = () => {
    setIsTrue("not-selected");
  }

  const handleStop = () => {
    setIsTrue("not-selected");
    handleClose();
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleStop}
        PaperProps={{
          sx: {
            borderRadius: 2,
            padding: 2,
            backgroundColor: "transparent",
            boxShadow: "none",
            minWidth: 1000
          },
        }}
        // aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{
            minWidth: 800
          }}
        >
          <Box
            sx={{
              display: "flex"
            }}
          >
            <Box>
              <img
                src={isTrue ? fullCat : sadCat}
                style={{
                  height: 400
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#ADCBF0FF",
                  padding: 4,
                  borderRadius: "59px 59px 59px 0px",
                  position: "relative",
                }}
              >
                <Button
                  sx={{
                    padding: 0,
                    minWidth: 0,
                    position: "absolute",
                    right: 0,
                    top: 0,
                    backgroundColor: "#ADCBF0FF",
                    "&:hover": {
                      backgroundColor: "#ADCBF0FF",
                    }
                  }}
                >
                  <Icon as={IoCloseCircleOutline} onClick={handleStop}/>
                </Button>
                {isTrue === "not-selected" && <Box>
                  <Typography variant="h6">
                    {"Bạn hãy thử sức với câu hỏi gợi ý dưới đây!"}
                  </Typography>
                </Box>}
                {isTrue !== "not-selected" &&
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1
                    }}
                  >
                    <Typography variant="h6" textAlign={"center"}>
                      {isTrue === false ? "Sai mất rồi! Bạn có muốn thử lại không?" : "Giỏi quá! Bạn có có muốn tiếp tục không?"}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        justifyContent: "center"
                      }}
                    >
                      <Button
                        size={"small"}
                        sx={{
                          backgroundColor: '#1A4E8DFF',
                          borderRadius: 1,
                          color: 'white',
                          fontWeight: 700,
                          paddingX: 1,
                          ':hover': {
                            backgroundColor: 'rgba(26,78,141,0.8)',
                            boxShadow: '0 0 10px 0 rgba(26,78,141,0.5)'
                          }
                        }}
                        onClick={handleContinue}
                      >
                        Làm tiếp
                      </Button>
                      <Button
                        size={"small"}
                        sx={{
                          backgroundColor: '#FF8D6BFF',
                          borderRadius: 1,
                          color: 'white',
                          fontWeight: 700,
                          paddingX: 1,
                          ':hover': {
                            backgroundColor: 'rgba(255,141,107,0.8)',
                            boxShadow: '0 0 10px 0 rgba(255,141,107,0.5)'
                          }
                        }}
                        onClick={handleStop}
                      >
                        Dừng lại
                      </Button>
                    </Box>
                  </Box>
                }
              </Box>
              <Box
                sx={{
                  backgroundColor: "#F2F7FDFF",
                  padding: 2,
                  borderRadius: "0px 59px 59px 59px",
                  marginTop: 2
                }}
              >
                <QuestionCard {...question} showAnswer={true} setIsTrue={setIsTrue} />
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

const question = parseQuestion({
  "_id": "ec39f0c1-43e9-4594-af9c-f6bd1001513b",
  "__v": 0,
  "createdAt": "2024-09-11T15:41:22.888Z",
  "difficulty": 0.5,
  "notionDatabaseId": "c3a788eb31f1471f9734157e9516f9b6",
  "properties": {
    "D": {
      "id": "%3DUID",
      "type": "rich_text",
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "Máy tính dùng bộ xử lí bằng đèn bán dẫn, mạch in",
            "link": null
          },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": "Máy tính dùng bộ xử lí bằng đèn bán dẫn, mạch in",
          "href": null
        }
      ]
    },
    "set_question_id": {
      "id": "%3F%5Eh%40",
      "type": "rich_text",
      "rich_text": []
    },
    "A": {
      "id": "NrRV",
      "type": "rich_text",
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "Máy tính sử dụng các bóng đèn điện tử chân không",
            "link": null
          },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": "Máy tính sử dụng các bóng đèn điện tử chân không",
          "href": null
        }
      ]
    },
    "img": {
      "id": "QNs%3D",
      "type": "rich_text",
      "rich_text": []
    },
    "correct": {
      "id": "%5DCtA",
      "type": "rich_text",
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "c",
            "link": null
          },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": "c",
          "href": null
        }
      ]
    },
    "question": {
      "id": "aZ%3Eh",
      "type": "rich_text",
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "Thế hệ 3 có sự ra đời của",
            "link": null
          },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": "Thế hệ 3 có sự ra đời của",
          "href": null
        }
      ]
    },
    "audio": {
      "id": "fp%3EK",
      "type": "rich_text",
      "rich_text": []
    },
    "context": {
      "id": "ghZt",
      "type": "rich_text",
      "rich_text": []
    },
    "tags": {
      "id": "iHQZ",
      "type": "multi_select",
      "multi_select": [
        {
          "id": "A@Qv",
          "name": "may-tinh-dien-tu",
          "color": "red"
        }
      ]
    },
    "code": {
      "id": "iVXi",
      "type": "rich_text",
      "rich_text": []
    },
    "B": {
      "id": "jOan",
      "type": "rich_text",
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "Máy tính bắt đầu có các vi mạch đa xử lí với tốc độ tính từ hàng chục triệu đến hàng tỉ phép tính/giây",
            "link": null
          },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": "Máy tính bắt đầu có các vi mạch đa xử lí với tốc độ tính từ hàng chục triệu đến hàng tỉ phép tính/giây",
          "href": null
        }
      ]
    },
    "C": {
      "id": "oR%3A%7B",
      "type": "rich_text",
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "Máy tính được gắn các bộ vi xử lí bằng vi mạch điện tử cỡ nhỏ",
            "link": null
          },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": "Máy tính được gắn các bộ vi xử lí bằng vi mạch điện tử cỡ nhỏ",
          "href": null
        }
      ]
    },
    "hint": {
      "id": "%7Dwgm",
      "type": "rich_text",
      "rich_text": []
    },
    "index": {
      "id": "title",
      "type": "title",
      "title": [
        {
          "type": "text",
          "text": {
            "content": "19",
            "link": null
          },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": "19",
          "href": null
        }
      ]
    }
  },
  "totalComments": 0,
  "updatedAt": "2024-09-11T15:41:22.888Z",
  "encoded_exercise_id": 35,
  "chapter": "chuong-1"
});