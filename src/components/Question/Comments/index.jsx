import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import {
  Container,
  Icon,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { IoSend } from "react-icons/io5";
import Comment from "~/components/Question/Comments/Comment/index.jsx";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getComments, postComment } from "~/services/question.service.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import pushToast from "~/helpers/sonnerToast.js";
import { IoMdRefresh } from "react-icons/io";
import cookies from "~/utils/cookies.js";

const commentFormStyle = (theme) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "1rem auto",
  maxWidth: "100%",
  gap: 1,
});

function Comments({ openComments, questionId = "" }) {
  const theme = useTheme();
  const [hasInitialLoad, setHasInitialLoad] = useState(false);
  const [commentsData, setCommentsData] = useState({
    comments: [],
    isMore: false,
    total: 0,
  });
  const [limit] = useState(10); // Fixed limit
  const [offset, setOffset] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPostingComment, setIsPostingComment] = useState(false);
  const commentsCache = useRef(new Map());
  const abortControllerRef = useRef(null);
  const refreshTimeoutRef = useRef(null);
  const lastFetchTimeRef = useRef(0);
  const previousOpenState = useRef(openComments);
  const user = cookies.get("user", { path: "/" });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: undefined,
    criteriaMode: "firstError",
  });

  // Watch content field to enable/disable submit button
  const commentContent = watch("content", "");

  // Process and deduplicate comments
  const processComments = useCallback((newComments, existingComments = []) => {
    // Create a Map with existing comments for faster lookup
    const commentMap = new Map(
      existingComments.map((comment) => [comment._id, comment])
    );

    // Add or update with new comments
    newComments.forEach((comment) => {
      commentMap.set(comment._id, comment);
    });

    // Convert back to array and sort
    return Array.from(commentMap.values()).sort((a, b) => {
      // Sort by left value if available (asc)
      if (a.left && b.left) return a.left - b.left;

      // If only one has left value, prioritize it
      if (a.left) return -1;
      if (b.left) return 1;

      // Otherwise sort by creation date (newest first)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, []);

  // Memoize processed comments to avoid unnecessary re-renders
  const comments = useMemo(
    () => processComments(commentsData.comments),
    [commentsData.comments, processComments]
  );

  // Cancel any pending requests
  const cancelPendingRequests = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Fetch comments with proper caching and abort control
  const fetchComments = useCallback(
    async (offset = 0, isLoadMore = false, forceRefresh = false) => {
      // Don't fetch if comments section is closed
      if (!openComments) return;

      try {
        // Prevent duplicate requests in quick succession
        const now = Date.now();
        if (now - lastFetchTimeRef.current < 300 && !forceRefresh) {
          return;
        }
        lastFetchTimeRef.current = now;

        // Setup loading state
        if (isLoadMore) {
          setIsLoadingMore(true);
        } else if (!isLoadMore && offset === 0) {
          setIsRefreshing(true);
        }

        // Cancel any pending requests before making a new one
        cancelPendingRequests();

        // Create a new abort controller for this request
        abortControllerRef.current = new AbortController();
        const { signal } = abortControllerRef.current;

        // Check cache first if not forcing refresh
        const cacheKey = `${questionId}-${offset}-${limit}`;
        if (!forceRefresh && commentsCache.current.has(cacheKey)) {
          const cachedData = commentsCache.current.get(cacheKey);
          const cacheAge = now - cachedData.timestamp;

          // Use cache if it's less than 30 seconds old
          if (cacheAge < 30000) {
            if (isLoadMore) {
              setCommentsData((prev) => ({
                comments: processComments([
                  ...prev.comments,
                  ...cachedData.data.comments,
                ]),
                isMore: cachedData.data.isMore,
                total: cachedData.data.total,
              }));
            } else {
              setCommentsData(cachedData.data);
            }
            setHasInitialLoad(true);
            return;
          }
        }

        // Fetch from API
        const response = await getComments(
          {
            questionId,
            limit,
            offset,
          },
          signal
        );

        if (!response || response.statusCode !== 200) {
          throw new Error(response?.message || "Failed to load comments");
        }

        // Update cache
        commentsCache.current.set(cacheKey, {
          data: response.metadata,
          timestamp: now,
        });

        // Update state based on whether we're loading more or refreshing
        if (isLoadMore) {
          setCommentsData((prev) => ({
            comments: processComments([
              ...prev.comments,
              ...response.metadata.comments,
            ]),
            isMore: response.metadata.isMore,
            total: response.metadata.total,
          }));
        } else {
          setCommentsData({
            comments: processComments(response.metadata.comments),
            isMore: response.metadata.isMore,
            total: response.metadata.total,
          });
        }

        setHasInitialLoad(true);
      } catch (error) {
        // Don't show error for aborted requests
        if (error.name !== "AbortError") {
          pushToast(
            "Không thể tải bình luận: " +
              (error.message || "Lỗi không xác định"),
            "error"
          );
        }
      } finally {
        setIsLoadingMore(false);
        setIsRefreshing(false);
      }
    },
    [questionId, limit, processComments, cancelPendingRequests, openComments]
  );

  // Load more comments
  const handleLoadMore = useCallback(() => {
    if (isLoadingMore || !commentsData.isMore) return;
    const newOffset = offset + limit;
    setOffset(newOffset);
    fetchComments(newOffset, true);
  }, [offset, limit, commentsData.isMore, isLoadingMore, fetchComments]);

  // Reset to first page
  const handleResetPage = useCallback(() => {
    setOffset(0);
    fetchComments(0, false, true);
  }, [fetchComments]);

  // Handle refresh with debounce
  const handleRefresh = useCallback(() => {
    if (isRefreshing) {
      pushToast("Đang tải lại bình luận...", "info");
      return;
    }

    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    setIsRefreshing(true);
    refreshTimeoutRef.current = setTimeout(() => {
      handleResetPage();
      refreshTimeoutRef.current = null;
    }, 300);
  }, [isRefreshing, handleResetPage]);

  // Submit a new comment with optimistic update
  const onSubmit = useCallback(
    async (data) => {
      if (!data.content?.trim()) {
        pushToast("Nội dung không được để trống!", "error");
        return;
      }

      try {
        setIsPostingComment(true);

        // Create an optimistic comment
        const optimisticId = `temp-${Date.now()}`;
        const optimisticComment = {
          _id: optimisticId,
          itemId: questionId,
          user: { ...user },
          content: data.content.trim(),
          createdAt: new Date().toISOString(),
          _isOptimistic: true,
        };

        // Update UI immediately
        setCommentsData((prev) => ({
          ...prev,
          comments: [optimisticComment, ...prev.comments],
          total: prev.total + 1,
        }));

        // Reset form
        reset();

        // Send to server
        const res = await postComment({
          content: data.content.trim(),
          questionId,
        });

        if (res.statusCode !== 200) {
          throw new Error(res.message || "Failed to post comment");
        }

        // Refresh comments to get the actual comment
        await fetchComments(0, false, true);
      } catch (error) {
        // Remove optimistic comment on error
        setCommentsData((prev) => ({
          ...prev,
          comments: prev.comments.filter((c) => !c._isOptimistic),
          total: Math.max(0, prev.total - 1),
        }));
        pushToast(
          "Không thể đăng bình luận: " +
            (error.message || "Lỗi không xác định"),
          "error"
        );
      } finally {
        setIsPostingComment(false);
      }
    },
    [questionId, user, reset, fetchComments]
  );

  const onError = useCallback((errors) => {
    Object.values(errors).forEach((error) => {
      toast.error(error.message);
    });
  }, []);

  // Initial load and cleanup
  useEffect(() => {
    // Only load comments when opened and no initial load has happened yet
    if (openComments && !hasInitialLoad && questionId) {
      fetchComments(0);
    }

    // Track open state changes
    if (previousOpenState.current !== openComments) {
      previousOpenState.current = openComments;
      // If comments were closed then reopened, refresh data
      if (openComments && hasInitialLoad) {
        fetchComments(0, false, true);
      }
    }

    return () => {
      cancelPendingRequests();
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [
    openComments,
    hasInitialLoad,
    questionId,
    fetchComments,
    cancelPendingRequests,
  ]);

  // Loading and empty states
  const isLoading = isRefreshing && offset === 0;
  const isEmpty = !isLoading && comments.length === 0;
  const isSubmitDisabled = isPostingComment || !commentContent?.trim();

  return (
    <Collapse
      in={openComments}
      sx={{
        backgroundColor: theme.palette.questionBackground.secondary,
        borderRadius: 2,
        marginY: 2,
      }}
    >
      <Container
        maxWidth={"md"}
        sx={{
          padding: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 2,
          }}
        >
          <Typography variant={"h6"} fontWeight={700}>
            Bình luận {commentsData.total > 0 && `(${commentsData.total})`}
          </Typography>
          <Button
            variant={"text"}
            sx={{
              fontSize: "12px",
              minWidth: 0,
              paddingX: 1,
              paddingY: 0.5,
            }}
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <Icon as={IoMdRefresh} />
            {isRefreshing ? "Đang tải..." : "Làm mới"}
          </Button>
        </Box>
        <Box sx={{ ...commentFormStyle(theme) }}>
          <Avatar className="comment-avatar" src={user?.avatar} />
          <Box
            sx={{
              width: "100%",
              display: "flex",
            }}
          >
            <form
              onSubmit={handleSubmit(onSubmit, onError)}
              noValidate={true}
              autoComplete={"off"}
              style={{
                width: "100%",
                display: "flex",
                gap: 1,
              }}
            >
              <TextField
                fullWidth
                size="small"
                variant={"standard"}
                placeholder={"Bình luận gì đó..."}
                {...register("content", {
                  required: "Không thể để trống!",
                })}
                autoComplete={"off"}
                disabled={isPostingComment}
              />
              <Button
                variant="text"
                type={"submit"}
                sx={{ fontSize: "12px", minWidth: 0 }}
                disabled={isSubmitDisabled}
              >
                <Icon as={IoSend} />
              </Button>
            </form>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {isLoading ? (
            <Typography variant="body2" sx={{ textAlign: "center", my: 2 }}>
              Đang tải bình luận...
            </Typography>
          ) : isEmpty ? (
            <Typography variant={"body2"} sx={{ textAlign: "center", my: 2 }}>
              Chưa có bình luận nào!
            </Typography>
          ) : (
            <>
              {comments.map((comment) => (
                <Comment
                  key={comment._id}
                  comment={comment}
                  isOptimistic={comment._isOptimistic}
                />
              ))}

              {isLoadingMore && (
                <Typography variant="body2" sx={{ textAlign: "center", my: 1 }}>
                  Đang tải thêm bình luận...
                </Typography>
              )}
            </>
          )}
        </Box>

        {(commentsData.isMore || offset > 0) && !isEmpty && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 1,
              marginTop: 2,
            }}
          >
            {commentsData.isMore && (
              <Button
                variant={"contained"}
                sx={{
                  backgroundColor: "#1A4E8DFF",
                  borderRadius: 5,
                  color: "white",
                  fontSize: "12px",
                  transition: "all 0.2s ease-in-out",
                  ":hover": {
                    backgroundColor: "rgba(26,78,141,0.8)",
                    boxShadow: "0 0 10px 0 rgba(26,78,141,0.5)",
                  },
                }}
                onClick={handleLoadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? "Đang tải..." : "Xem thêm"}
              </Button>
            )}
            {offset > 0 && (
              <Button
                variant={"contained"}
                sx={{
                  backgroundColor: "#1A4E8DFF",
                  borderRadius: 5,
                  color: "white",
                  fontSize: "12px",
                  transition: "all 0.2s ease-in-out",
                  ":hover": {
                    backgroundColor: "rgba(26,78,141,0.8)",
                    boxShadow: "0 0 10px 0 rgba(26,78,141,0.5)",
                  },
                }}
                onClick={handleResetPage}
                disabled={isRefreshing}
              >
                Ẩn bớt
              </Button>
            )}
          </Box>
        )}
      </Container>
    </Collapse>
  );
}

export default Comments;
