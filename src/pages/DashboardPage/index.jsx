import useActiveTab from "~/hooks/useActiveTab.jsx";
import {useEffect, useState} from "react";
import {getCertificates} from "~/services/app.service.js";
import {parseCertificate} from "~/helpers/parseNotionResponseToObject.js";
import Box from "@mui/material/Box";
import {Container, Typography, useTheme} from "@mui/material";
import CertificateCard from "~/components/CertificateCard/index.jsx";
import {getResult} from "~/services/question.service.js";
import * as React from "react";
import Loading from "~/components/Loading/index.jsx";

export default function DashboardPage() {
  const theme = useTheme();
  const {updateActiveTab} = useActiveTab();
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      const res = await getCertificates();
      let certs = (res?.data?.results?.map(item => parseCertificate(item))?.filter(item => !!item));

      for (const cert of certs) {
        const result = await getResult({
          certificateId: cert.id
        })
        cert.results = result.metadata || [];
      }

      certs = certs
        .filter(cert => cert.results.length > 0);

      setCertificates(certs);
    }
    fetchCertificates().then(() => setIsLoading(false));
    updateActiveTab('dashboard');
  }, []);

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
            border: "1px solid #e0e0e0",
            padding: "36px",
            borderRadius: "10px",
          }}
        >
          <Typography variant="h5" fontWeight={700} sx={{}}>
            Lịch sử làm bài
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              marginTop: 2,
              flexWrap: "wrap"
            }}
          >
            {certificates.length > 0 && certificates.map((cert, index) => {
              return (
                <CertificateCard
                  key={index}
                  cert={cert}
                />
              )
            })}
          </Box>
        </Box>
      </Container>
    </>
  );
}