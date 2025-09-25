import * as React from "react";
import { Box, Drawer, Typography, Button } from "@mui/material";
import { MdHelp } from "react-icons/md";

// quét tất cả file hướng dẫn trong ./guides (Vite)
const GUIDE_MODULES = import.meta.glob("./guides/**/*.jsx");

// Fallback component khi không tìm thấy slug
function NotFound({ slug }) {
  return (
    <Box p={2}>
      <Typography variant="subtitle1" fontWeight={700} gutterBottom>
        Chưa có hướng dẫn cho trang này
      </Typography>
    </Box>
  );
}

export default function HelpGuide({
  slug,
  title,
  placement = { bottom: 24, right: 24 },
  width = 600,
}) {
  const [open, setOpen] = React.useState(false);
  const [GuideComp, setGuideComp] = React.useState(() => null);

  const resolveModuleKey = React.useCallback((s) => {
    if (!s) return null;
    const target = `/${s}.jsx`;
    return Object.keys(GUIDE_MODULES).find((k) => k.endsWith(target));
  }, []);

  React.useEffect(() => {
    if (!slug) {
      setGuideComp(() => () => <NotFound slug={"(không có slug)"} />);
      return;
    }
    const key = resolveModuleKey(slug);
    if (!key) {
      setGuideComp(() => () => <NotFound slug={slug} />);
      return;
    }
    GUIDE_MODULES[key]().then((mod) => {
      const Cmp = mod?.default ? mod.default : () => <NotFound slug={slug} />;
      setGuideComp(() => Cmp);
    });
  }, [slug, resolveModuleKey]);

  return (
    <>
      {/* Nút nổi cố định (giữ nguyên style của bạn) */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<MdHelp size={22} />}
        onClick={() => setOpen(true)}
        sx={{
          position: "fixed",
          bottom: placement.bottom ?? 24,
          right: placement.right ?? 24,
          borderRadius: "999px",
          textTransform: "none",
          fontWeight: 600,
          fontSize: 16,
          px: 3,
          py: 1.5,
          background: "#1A4E8DFF",
          boxShadow: 3,
          "&:hover": {
            backgroundColor: "rgba(26,78,141,0.85)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          },
        }}
      >
        Help
      </Button>

      {/* Panel trượt từ phải (overlay trong suốt, click-outside vẫn đóng) */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        BackdropProps={{ sx: { backgroundColor: "transparent" } }}
        PaperProps={{
          sx: {
            width,
            p: 0,
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* Header giữ nguyên */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            justifyContent: "space-between",
            p: 2,
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            HƯỚNG DẪN SỬ DỤNG HỆ THỐNG SCORE UP
          </Typography>
          <Typography variant="h6" fontWeight={700}>
            Trang {title}
          </Typography>
        </Box>

        {/* Nội dung hướng dẫn từ slug */}
        <Box sx={{ flex: 1, overflow: "auto" }}>
          {GuideComp ? <GuideComp /> : null}
        </Box>
      </Drawer>
    </>
  );
}
