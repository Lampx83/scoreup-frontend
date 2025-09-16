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
import { getSubjects, updateCreateExam } from "~/services/exam.service.js";

export default function ContentExam({ subjectId, onChangeChecked }) {
  const [checked, setChecked] = React.useState([]);
  const [numbers, setNumbers] = React.useState([]);
  const [chapters, setChapters] = React.useState([]);

  React.useEffect(() => {
    const fetchChapters = async () => {
      if (!subjectId) {
        setChapters([]);
        setChecked([]);
        setNumbers([]);
        return;
      }

      const subjects = await getSubjects();
      const subject = subjects.find((s) => String(s._id) === String(subjectId));

      const newChapters = subject?.chapters || [];
      setChapters(newChapters);
      setNumbers(Array(newChapters.length).fill(0));
      setChecked([]);
    };
    fetchChapters();
  }, [subjectId]);

  const handleToggle = (index) => {
    const currentIndex = checked.indexOf(index);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(index);
    } else {
      newChecked.splice(currentIndex, 1);
    }
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
