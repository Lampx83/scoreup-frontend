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

export default function ContentExam({ subject, onChangeChecked }) {
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
    setNumbers(Array(newChapters.length).fill(0));
    setChecked([]);
  }, [subject]);

  const handleToggle = (index) => {
    const newChecked = checked.includes(index)
      ? checked.filter((i) => i !== index)
      : [...checked, index];

    setChecked(newChecked);

    if (onChangeChecked) {
      const data = newChecked.map((i) => ({
        chapter: chapters[i].chapter,
        numbers: numbers[i],
      }));
      onChangeChecked(data);
    }
  };

  const handleNumberChange = (index, value) => {
    const newNumbers = [...numbers];
    newNumbers[index] = Number(value) || 0;
    setNumbers(newNumbers);

    if (onChangeChecked) {
      const data = checked
        .map((i) => ({
          chapter: chapters[i].chapter,
          numbers: newNumbers[i],
        }))
        .filter((c) => c.numbers > 0);
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
              <ListItemText primary={item.chapter} sx={{ flex: 1 }} />
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
      )}
    </Box>
  );
}
