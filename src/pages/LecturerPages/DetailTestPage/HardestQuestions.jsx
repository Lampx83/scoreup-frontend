import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import Box from "@mui/material/Box";

const wrongCount = [50, 55, 50, 44, 40, 39, 38];
const attemptedCount = [60, 60, 60, 60, 60, 60, 60];
const xLabels = [
  'Câu 1',
  'Câu 2',
  'Câu 3',
  'Câu 4',
  'Câu 5',
  'Câu 6',
  'Câu 7',
  'Câu 8',
  'Câu 9',
  'Câu 10',
];

export default function HardestQuestions() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        marginTop: 3
      }}
    >
      <BarChart
        width={1000}
        height={300}
        series={[
          { data: attemptedCount, label: 'Số lượt làm', id: 'attemptedCount' },
          { data: wrongCount, label: 'Số lượt sai', id: 'wrongCount' },
        ]}
        xAxis={[{ data: xLabels, scaleType: 'band' }]}
      />
    </Box>
  );
}