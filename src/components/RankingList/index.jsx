import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import * as React from "react";

export default function RankingList({
  rankingList = [],
  user = null,
}) {

  return (
    <TableContainer>
      <Table
        sx={{
          minWidth: 650,
          borderCollapse: "separate",
          borderSpacing: "0 10px",
          "& .MuiTableRow-root": {
            border: "1px solid #e0e0e0",
            "& .MuiTableCell-root": {
              borderTop: "1px solid #e0e0e0",
              borderBottom: "1px solid #e0e0e0",
            },
            "& .MuiTableCell-root:first-of-type": {
              borderBottomLeftRadius: 10,
              borderTopLeftRadius: 10,
              borderLeft: "1px solid #e0e0e0",
            },
            "& .MuiTableCell-root:last-of-type": {
              borderTopRightRadius: 10,
              borderBottomRightRadius: 10,
              borderRight: "1px solid #e0e0e0",
            }
          }
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell align="center"></TableCell>
            <TableCell align="center"></TableCell>
            <TableCell align="center"></TableCell>
            <TableCell align="center">
              Số câu đã làm
            </TableCell>
            <TableCell align="center">
              Số câu đúng
            </TableCell>
            <TableCell align="center">
              Độ chính xác
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rankingList.length > 0 ? rankingList.map((item) => {
            return (
              <TableRow
                key={item.index}
                sx={{
                  backgroundColor: getRankItemColor(item.index, user, item),
                  border: "1px solid #e0e0e0",
                }}
              >
                <TableCell align="center">
                  <Typography color={getRankItemTextColor(item.index, user, item)} variant="h5" fontWeight={700}>
                    {item.index}
                  </Typography>
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    width: 35,
                  }}
                >
                  <Avatar
                    src={item.user.avatar}
                    sx={{
                      width: 35,
                      height: 35,
                    }}
                    alt="avatar"
                  >
                    {item?.user?.fullName?.split(' ').slice(-1)[0][0] || "N/A"}
                  </Avatar>
                </TableCell>
                <TableCell align={"center"}>
                  <Typography
                    variant="body1"
                    fontWeight={600}
                    sx={{
                      textAlign: "left",
                      color: user && item?.user?._id === user?._id ? "#FFFFFFFF" : "#323842FF"
                    }}
                  >
                    {item?.user?._id === user?._id ? "Bạn" : item.user.fullName}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body1" color={getRankItemTextColor(item.index, user, item)} fontWeight={700}>
                    {item.total}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body1" color={getRankItemTextColor(item.index, user, item)} fontWeight={700}>
                    {item.correct}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body1" color={getRankItemTextColor(item.index, user, item)} fontWeight={700}>
                    {item.accuracy}%
                  </Typography>
                </TableCell>
              </TableRow>
            )
          }) : (
            <TableRow>
              <TableCell align="center" colSpan={6}>
                <Typography variant="body1" sx={{color: "#9e9e9e"}}>
                  Chưa có ai trên bảng xếp hạng!
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export const getRankItemColor = (index, user, item) => {
  if (user && item?.user?._id === user?._id) {
    return "#1A4E8DFF";
  }
  switch (index) {
    case 1:
      return "#FFDC6EFF";
    case 2:
      return "#DEE1E6FF";
    case 3:
      return "#E6C2B8FF";
    default:
      return "#FFFFFFFF";
  }
}

export const getRankItemTextColor = (index, user, item) => {
  if (user && item?.user?._id === user?._id) {
    return "#FFFFFFFF";
  }
  switch (index) {
    case 1:
      return "#9E7900FF";
    case 2:
      return "#9095A0FF";
    case 3:
      return "#B86850FF";
    default:
      return "#323842FF";
  }
}