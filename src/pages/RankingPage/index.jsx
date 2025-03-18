import {Typography} from "@mui/material";
import RankingList from "~/components/RankingList/index.jsx";
import Box from "@mui/material/Box";
import * as React from "react";
import {useEffect, useState} from "react";
import {getRank} from "~/services/question.service.js";
import cookies from "~/utils/cookies.js";

export default function RankingPage() {
  const [rankingList, setRankingList] = useState([]);
  const user = cookies.get("user");

  useEffect(() => {
    const fetchRankingList = async () => {
      const res = await getRank();
      setRankingList(res?.metadata || []);
    }
    fetchRankingList();
  }, []);
  
  return (
    <Box
      sx={{
        marginY: 4,
        border: "1px solid #e0e0e0",
        padding: 2,
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" fontWeight={700} sx={{}}>
        Bảng xếp hạng
      </Typography>
      <Typography variant="body1" sx={{color: "#9e9e9e"}}>
        Bảng xếp hạng được làm mới mỗi tuần.
      </Typography>
      <Typography variant="body1" sx={{color: "#9e9e9e"}}>
        Hoàn thành ít nhất 30 câu hỏi để được hiển thị trên bảng xếp hạng.
      </Typography>
      <RankingList rankingList={rankingList} user={user}/>
    </Box>
  )
}