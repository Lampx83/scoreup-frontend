import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getResult} from "~/services/question.service.js";
import Box from "@mui/material/Box";
import {Chip, Container, TableContainer, Typography, useTheme} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {moment} from "~/utils/moment.js";
import * as React from "react";
import {getPage} from "~/utils/request.js";
import {parseCertificate} from "~/helpers/parseNotionResponseToObject.js";
import Loading from "~/components/Loading/index.jsx";
import Button from "@mui/material/Button";
import {GrReturn} from "react-icons/gr";
import {IoIosArrowBack} from "react-icons/io";

const columns = [
  {
    field: 'createdAt',
    headerName: 'Thời gian',
    width: 500,
    renderCell: (params) => {
      return moment(params.row.createdAt).format("hh:mm, DD/MM/YYYY")
    }
  },
  {
    field: 'total',
    headerName: 'Điểm số',
    width: 200,
    renderCell: (params) => {
      return (params.row.correct || 0) + "/" + params.row.total
    }
  },
  {
    field: "id",
    headerName: "Chi tiết",
    width: 100,
    renderCell: (params) => {
      return <Chip
        variant={"outlined"}
        label={"Xem"}
        component={Link}
        to={`/history/${params.row.certificateId}/${params.row.id}`}
        clickable
      />
    }
  }
]

export default function HistoryPage() {
  const theme = useTheme();
  const {id} = useParams();
  const [results, setResults] = useState([]);
  const [cert, setCert] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const res = await getResult({
        certificateId: id
      })
      const certInfo = await getPage(id);

      setResults(res.metadata.map(item => ({
        id: item._id,
        ...item
      })));
      setCert(parseCertificate(certInfo));
      setIsLoading(false);
    }
    fetchData()
  }, [id]);

  return (
    <>
      {isLoading && <Loading/>}
      <Container
        maxWidth={false}
        sx={{
          margin: "auto",
          width: "100%",
          position: "relative",
          maxWidth: theme.breakpoints.values.lg
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "flex-start",
            alignItems: "center",
            marginBottom: 2
          }}
        >
          <Button
            sx={{
              padding: 1
            }}
            onClick={() => navigate(-1)}
          >
            <IoIosArrowBack/>
          </Button>
          <Typography
            variant="h5"
            fontWeight={700}
          >
            {cert?.title}
          </Typography>
        </Box>
        <DataGrid
          columns={columns}
          rows={results}
          disableRowSelectionOnClick
          pageSizeOptions={[10]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10
              }
            }
          }}
          sx={{
            width: "100%",
            maxWidth: "900px",
          }}
        />
      </Container>
    </>
  );
}