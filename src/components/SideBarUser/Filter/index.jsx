import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import { TbFilter } from "react-icons/tb";
import ListItemText from "@mui/material/ListItemText";
import Popper from "@mui/material/Popper";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grow,
  List,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import Box from "@mui/material/Box";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import * as React from "react";
import { memo, useEffect, useRef } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import NestedList from "~/components/NestedList/index.jsx";
import { getCertificates } from "~/services/app.service.js";
import { parseCertificate } from "~/helpers/parseNotionResponseToObject.js";
import useFilterQuestion from "~/hooks/useFilterQuestion.jsx";
import pushToast from "~/helpers/sonnerToast.js";

function Filter({ active = {}, open = false }) {
  const theme = useTheme();
  const [openFilter, setOpenFilter] = React.useState(false);
  const [anchorElFilter, setAnchorElFilter] = React.useState(null);
  const [certificates, setCertificates] = React.useState([]);
  const {filter, updateFilter} = useFilterQuestion();
  const [selectedCertificate, setSelectedCertificate] = React.useState(filter.certificateDatabaseId || null);
  const [selectedSections, setSelectedSections] = React.useState(filter.tags || []);
  const [certificateInfo, setCertificateInfo] = React.useState(filter.certificateInfo || {});

  const handleClickFilterButton = (event) => {
    setAnchorElFilter(event.currentTarget);
    setOpenFilter((previousOpen) => !previousOpen);
    setSelectedCertificate(filter.certificateDatabaseId || null);
    setSelectedSections(filter.tags || []);
  };
  const canBeOpenFilter = openFilter && Boolean(anchorElFilter);
  const idFilter = canBeOpenFilter ? "transition-popper" : undefined;
  const popperFilterRef = useRef(null);


  useEffect(() => {
    const getCertificatesData = async () => {
      const response = await getCertificates();
      setCertificates(
        response.data.results
          .map(parseCertificate)
          .filter((certificate) => certificate)
          .sort((a, b) => a.priority - b.priority)
          // .slice(0, 4),
      );
    };
    getCertificatesData();
  }, []);

  const handleSelectCertificate = (certificateDatabaseId, certificateInfo) => {
    setSelectedCertificate(certificateDatabaseId);
    setCertificateInfo(certificateInfo);
    setSelectedSections([]);
  };

  const handleSelectSection = (event, tag, limit, multi, title) => {
    const tags = new Set(selectedSections);
    if (event.target.checked) {
      // tags.add(event.target.value);
      // tags.add(tag);
      tags.add({
        tag: tag,
        limit: limit,
        multiQuestions: multi,
        section: title
      })
    }
    else {
      // tags.delete(event.target.value);
      tags.forEach((item, index) => {
        if (item.tag === tag) {
          tags.delete(item);
        }
      });
    }
    if (tags.size === 0) {
      pushToast("Vui lòng chọn ít nhất một nội dung học", "error");
    }
    setSelectedSections(Array.from(tags).sort((a, b) => a.tag.localeCompare(b.tag)));
  }

  const handleChangeLimit = (tag, limit) => {
    if (parseInt(limit) <= 0) {
      pushToast("Số lượng câu hỏi cần lớn hơn 0", "error");
      return;
    }
    if (parseInt(limit) > certificateInfo.sectionInfo.find(item => item.tag === tag).number_questions) {
      pushToast("Vượt quá giới hạn số lượng câu hỏi!", "error");
      limit = certificateInfo.sectionInfo.find(item => item.tag === tag).number_questions;
    }

    const newSections = selectedSections.map((section) => {
      if (section.tag === tag) {
        return {
          ...section,
          limit: parseInt(limit) || 0
        }
      }
      return section;
    });
    setSelectedSections(newSections);
  }

  const handleChangeShowAnswer = (event) => {
    setCertificateInfo({
      ...certificateInfo,
      showAnswer: event.target.checked
    });
  }

  const handleSaveFilter = () => {
    const isValid = selectedSections.every((section) => section.limit > 0);

    if (selectedSections.length === 0) {
      pushToast("Vui lòng chọn ít nhất một nội dung học", "error");
    }
    if (isValid) {
      updateFilter(selectedCertificate, selectedSections, certificateInfo);
    }
  }

  return (
    <ClickAwayListener onClickAway={() => setOpenFilter(false)}>
      <ListItem disablePadding style={{ display: "block" }}>
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: open ? "initial" : "center",
            px: 2.5,
            ...(openFilter && active),
          }}
          aria-describedby={idFilter}
          onClick={handleClickFilterButton}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : "auto",
              justifyContent: "center",
            }}
          >
            <TbFilter style={{ width: "24px", height: "24px" }} />
          </ListItemIcon>
          <ListItemText primary={"Bộ lọc"} sx={{ opacity: open ? 1 : 0 }} />
        </ListItemButton>

        <Popper
          id={idFilter}
          open={openFilter}
          anchorEl={anchorElFilter}
          transition
          placement="right"
          disablePortal={true}
          ref={popperFilterRef}
          sx={{
            overflow: "scroll",
            maxHeight: "calc(100vh)",
            '::-webkit-scrollbar': {
              display: 'none'
            },
            '::-webkit-scrollbar-thumb': {
              display: 'none'
            },
            '::-webkit-scrollbar-track': {
              display: 'none'
            },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            boxShadow: theme.palette.boxShadow,
            borderRadius: 2,
          }}
          modifiers={[
            {
              name: "flip",
              enabled: true,
              options: {
                altBoundary: true,
                rootBoundary: "viewport",
                padding: 8,
              },
            },
            {
              name: "preventOverflow",
              enabled: true,
              options: {
                altAxis: false,
                altBoundary: true,
                tether: true,
                rootBoundary: "viewport",
                padding: 8,
              },
            },
          ]}
        >
          {({ TransitionProps }) => (
            <Grow
              {...TransitionProps}
              direction="right"
              timeout={350}
              container={popperFilterRef.current}
            >
              <Box
                sx={{
                  padding: "8px 16px",
                  backgroundColor: theme.palette.headerBackground,
                  backdropFilter: "blur(10px)",
                  borderRadius: 2,
                  minWidth: "400px",
                  marginLeft: 1,
                  boxSizing: "border-box",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingBottom: "8px",
                  }}
                >
                  <Typography variant="h6">Bộ lọc</Typography>
                  <Button
                    sx={{
                      minWidth: 0,
                      padding: 0,
                      "&:hover, &:active": {
                        color: theme.palette.text.secondary,
                        backgroundColor: "transparent",
                      },
                    }}
                    onClick={() => setOpenFilter(false)}
                  >
                    <IoCloseCircleOutline
                      style={{ width: "24px", height: "24px" }}
                    />
                  </Button>
                </Box>
                <Divider />
                <List>
                  <ListItem disablePadding sx={{ display: "block" }}>
                    <FormControl
                      sx={{
                        display: "flex",
                        gap: 3,
                      }}
                    >
                      <FormControlLabel
                        control={<Checkbox/>}
                        label="Hiện đáp án ngay"
                        onChange={handleChangeShowAnswer}
                        checked={certificateInfo?.showAnswer}
                      />
                    </FormControl>
                  </ListItem>
                  <ListItem disablePadding sx={{ display: "block" }}>
                    <NestedList
                      title={"Môn học"}
                      level={0}
                      initState={true}
                      sx={{
                        minHeight: 48,
                        px: 0,
                        overflowX: "hidden",
                        display: "flex",
                        justifyContent: "flex-start",
                      }}
                    >
                      <ListItem component={"div"} disablePadding={true}>
                        <FormControl>
                          <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              flexDirection: "row",
                              gap: 1,
                            }}
                            value={selectedCertificate}
                            onChange={(e) => {
                              handleSelectCertificate(e.target.value, certificates.find(item => item.databaseId === e.target.value));
                            }}
                          >
                            {certificates.map((certificate, index) => (
                              <FormControlLabel
                                key={index}
                                sx={{
                                  flexBasis: "50%",
                                  width: "100%",
                                  marginRight: 0,
                                }}
                                value={certificate.databaseId}
                                control={<Radio/>}
                                label={certificate.title}
                              />
                            ))}
                          </RadioGroup>
                        </FormControl>
                      </ListItem>
                    </NestedList>
                  </ListItem>
                  <ListItem disablePadding sx={{ display: "block" }}>
                    <NestedList
                      title={"Nội dung học"}
                      level={0}
                      initState={true}
                      sx={{
                        minHeight: 48,
                        px: 0,
                        overflowX: "hidden",
                        display: "flex",
                        justifyContent: "flex-start",
                      }}
                    >
                      <ListItem component={"div"} disablePadding={true}>
                        <FormGroup
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            flexDirection: "row",
                            gap: 1,
                            width: "100%"
                          }}
                        >
                          {certificates.find(item => item.databaseId === selectedCertificate)?.sectionInfo.map((section, index) => (
                            <Box
                              sx={{
                                display: "flex",
                                // flexWrap: "wrap",
                                flexDirection: "row",
                                gap: 1,
                                width: "100%",
                                justifyContent: "space-between",
                                flexBasis: "100%"
                              }}
                              key={selectedCertificate + index}
                            >
                              <FormControlLabel
                                sx={{
                                  flexBasis: "50%",
                                  width: "100%",
                                  marginRight: 0,
                                }}
                                control={<Checkbox/>}
                                label={section.section}
                                value={section.tag}
                                onChange={(e) => handleSelectSection(e, section.tag, section.number_questions, section.multi, section.section)}
                                checked={selectedSections.some(item => item.tag === section.tag)}
                              />
                              <TextField
                                sx={{
                                  flexBasis: "50%",
                                  width: "100%",
                                  marginRight: 0,
                                  padding: 0,
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 3,
                                  },
                                }}
                                size={"small"}
                                label={"Số lượng câu hỏi"}
                                type={"number"}
                                variant={"outlined"}
                                defaultValue={selectedSections.find(item => item.tag === section.tag)?.limit || section.number_questions}
                                onChange={(e) => handleChangeLimit(section.tag, e.target.value)}
                              />
                            </Box>
                          ))}
                        </FormGroup>
                      </ListItem>
                    </NestedList>
                  </ListItem>
                  <Divider sx={{ marginBottom: 2 }} />
                  <ListItem disablePadding sx={{ display: "block" }}>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 3,
                        justifyContent: "center",
                      }}
                    >
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => setOpenFilter(false)}
                        sx={{
                          borderRadius: 6,
                          // backgroundColor: theme.palette.text.primary,
                        }}
                      >
                        Hủy
                      </Button>
                      <Button
                        variant="contained"
                        fullWidth
                        sx={{
                          borderRadius: 6,
                          backgroundColor: theme.palette.text.secondary,
                          ":hover": {
                            backgroundColor: theme.palette.text.secondary,
                          },
                        }}
                        onClick={() => {
                          handleSaveFilter();
                          setOpenFilter(false);
                        }}
                      >
                        Áp dụng
                      </Button>
                    </Box>
                  </ListItem>
                </List>
              </Box>
            </Grow>
          )}
        </Popper>
      </ListItem>
    </ClickAwayListener>
  );
}

export default memo(Filter);