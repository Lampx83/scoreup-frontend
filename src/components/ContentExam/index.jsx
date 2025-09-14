import * as React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Checkbox,
  TextField,
} from "@mui/material";
const examContents = [
  "Chương 1: Lập trình C cơ bản",
  "Chương 2: Vào ra dữ liệu trong C",
  "Chương 3: Các cấu trúc lặp trình trong C",
  "Chương 4: Hàm trong C",
  "Chương 5: Con trỏ trong C",
  "Chương 6: Cấu trúc trong C",
];

export default function ContentExam({ onChangeChecked }) {
  const [checked, setChecked] = React.useState([]);
  const [numbers, setNumbers] = React.useState(
    Array(examContents.length).fill(0) // mảng số lượng, mặc định 0
  );

  const handleToggle = (index) => {
    const currentIndex = checked.indexOf(index);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(index);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
    onChangeChecked(newChecked);
  };

  const handleNumberChange = (index, value) => {
    const newNumbers = [...numbers];
    newNumbers[index] = value;
    setNumbers(newNumbers);
  };

  return (
    <Box sx={{ maxWidth: "50%" }}>
      <Typography fontWeight={600} mb={1}>
        Nội dung thi
      </Typography>

      <List>
        {examContents.map((label, index) => (
          <ListItem
            key={index}
            sx={{ display: "flex", alignItems: "center", gap: 2, px: 0 }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <Checkbox
                edge="start"
                checked={checked.includes(index)}
                tabIndex={-1}
                disableRipple
                onChange={() => handleToggle(index)}
              />
            </ListItemIcon>
            <ListItemText primary={label} sx={{ flex: 1 }} />
            <TextField
              type="number"
              value={numbers[index]}
              onChange={(e) => handleNumberChange(index, e.target.value)}
              size="small"
              sx={{ width: 70 }}
              inputProps={{ min: 0 }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
