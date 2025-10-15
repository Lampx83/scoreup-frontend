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

export default function ContentExam({
  subject,
  onChangeChecked,
  initialChapters = [],
}) {
  const [checked, setChecked] = React.useState([]);
  const [numbers, setNumbers] = React.useState([]);
  const [chapters, setChapters] = React.useState([]);

  React.useEffect(() => {
    if (!subject) {
      setChapters([]);
      setChecked([]);
      setNumbers([]);
      return;
    }

    const newChapters = subject.chapters || [];
    setChapters(newChapters);

    if (initialChapters?.length > 0) {
      const checkedIndexes = [];
      const nums = newChapters.map((ch, i) => {
        const found = initialChapters.find((c) => c.chapter === ch.chapter);
        if (found) {
          checkedIndexes.push(i);
          return found.numbers;
        }
        return "";
      });

      setChecked(checkedIndexes);
      setNumbers(nums);
    } else {
      setChecked([]);
      setNumbers(Array(newChapters.length).fill(""));
    }
  }, [subject, initialChapters]);

  const handleToggle = (index) => {
    const newChecked = [...checked];
    const newNumbers = [...numbers];

    if (checked.includes(index)) {
      const i = newChecked.indexOf(index);
      newChecked.splice(i, 1);
      newNumbers[index] = "";
    } else {
      newChecked.push(index);
      newNumbers[index] = 10;
    }

    setChecked(newChecked);
    setNumbers(newNumbers);

    if (onChangeChecked) {
      const data = newChecked.map((i) => ({
        chapter: chapters[i].chapter,
        numbers: newNumbers[i],
      }));
      onChangeChecked(data);
    }
  };

  const handleNumberChange = (index, value) => {
    const newNumbers = [...numbers];
    newNumbers[index] = value === "" ? "" : Number(value);
    setNumbers(newNumbers);

    if (onChangeChecked) {
      const data = checked.map((i) => ({
        chapter: chapters[i].chapter,
        numbers: newNumbers[i],
      }));
      onChangeChecked(data);
    }
  };
  return (
    <Box sx={{ maxWidth: "50%" }}>
      <Typography fontWeight={600} mt={1}>
        Nội dung thi
      </Typography>

      {chapters.length === 0 ? (
        <Typography color="text.secondary" mt={1}>
          Vui lòng chọn môn thi trước
        </Typography>
      ) : (
        <List>
          {chapters.map((item, index) => (
            <ListItem
              key={index}
              sx={{ display: "flex", alignItems: "center", gap: 2, px: 0 }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Checkbox
                  checked={checked.includes(index)}
                  onChange={() => handleToggle(index)}
                />
              </ListItemIcon>
              <ListItemText
                primary={item.chapter.replace(/^chuong_/, "Chương ")}
                sx={{ flex: 1 }}
              />
              <TextField
                type="number"
                value={numbers[index] === 0 ? "" : numbers[index]}
                onChange={(e) => handleNumberChange(index, e.target.value)}
                size="small"
                sx={{ width: 70 }}
                inputProps={{ min: 0 }}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}
