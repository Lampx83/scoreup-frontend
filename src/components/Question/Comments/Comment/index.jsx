import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { Icon, TextField, Typography, useTheme } from "@mui/material";
import Button from "@mui/material/Button";
import { BsReply } from "react-icons/bs";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getDiffTime } from "~/utils/moment.js";
import Collapse from "@mui/material/Collapse";
import { IoSend } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { getComments, postComment } from "~/services/question.service.js";
import pushToast from "~/helpers/sonnerToast.js";
import { toast } from "sonner";
import cookies from "~/utils/cookies.js";
import { IoMdRefresh } from "react-icons/io";

const commentStyle = (theme) => ({
  display: "flex",
  gap: 1,
  backgroundColor: theme.palette.questionBackground.secondary,
  borderRadius: 2,
  color: theme.palette.text.secondary,
  marginY: 1,
  opacity: (props) => (props?.isOptimistic ? 0.7 : 1),
  transition: "opacity 0.3s ease",
});

const commentFormStyle = (theme) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "1rem auto",
  width: "100%",
  gap: 1,
});

function Comment({ comment, isOptimistic }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [repliesData, setRepliesData] = useState({
    comments: [],
    isMore: false,
    total: 0,
  });
  const [limit] = useState(5);
  const [offset, setOffset] = useState(0);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const [isPostingReply, setIsPostingReply] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const repliesCache = useRef(new Map());
  const abortControllerRef = useRef(null);
  const refreshTimeoutRef = useRef(null);
  const lastFetchTimeRef = useRef(0);
  const user = cookies.get("user", { path: "/" });
  const hasLoadedInitialReplies = useRef(false);

  // Format creation time
  const timeAgo = useMemo(
    () => getDiffTime(comment.createdAt),
    [comment.createdAt]
  );

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
  const replyContent = watch("content", "");

  // Process comments to ensure proper ordering and deduplication
  const processReplies = useCallback((newReplies, existingReplies = []) => {
    // Create a Map with existing replies for faster lookup
    const replyMap = new Map(
      existingReplies.map((reply) => [reply._id, reply])
    );

    // Add or update with new replies
    newReplies.forEach((reply) => {
      replyMap.set(reply._id, reply);
    });

    // Convert back to array and sort
    return Array.from(replyMap.values()).sort((a, b) => {
      // Sort by left value if available (asc)
      if (a.left && b.left) return a.left - b.left;

      // If only one has left value, prioritize it
      if (a.left) return -1;
      if (b.left) return 1;

      // Otherwise sort by creation date (newest first)
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
  }, []);

  // Memoize processed replies to avoid unnecessary re-renders
  const replies = useMemo(
    () => processReplies(repliesData.comments),
    [repliesData.comments, processReplies]
  );

  // Cancel any pending requests
  const cancelPendingRequests = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Fetch replies with proper caching and abort control
  const fetchReplies = useCallback(
    async (offset = 0, isLoadMore = false, forceRefresh = false) => {
      // Don't fetch if this is a child comment or an optimistic comment
      if (comment.parentId || isOptimistic) return;

      try {
        // Prevent duplicate requests in quick succession
        const now = Date.now();
        if (now - lastFetchTimeRef.current < 300 && !forceRefresh) {
          return;
        }
        lastFetchTimeRef.current = now;

        // Setup loading state
        if (isLoadMore) {
          setIsLoadingReplies(true);
        } else if (!isLoadMore && offset === 0) {
          setIsRefreshing(true);
        }

        // Cancel any pending requests before making a new one
        cancelPendingRequests();

        // Create a new abort controller for this request
        abortControllerRef.current = new AbortController();
        const { signal } = abortControllerRef.current;

        // Check cache first if not forcing refresh
        const cacheKey = `${comment._id}-${offset}-${limit}`;
        if (!forceRefresh && repliesCache.current.has(cacheKey)) {
          const cachedData = repliesCache.current.get(cacheKey);
          const cacheAge = now - cachedData.timestamp;

          // Use cache if it's less than 30 seconds old
          if (cacheAge < 30000) {
            if (isLoadMore) {
              setRepliesData((prev) => ({
                comments: processReplies([
                  ...prev.comments,
                  ...cachedData.data.comments,
                ]),
                isMore: cachedData.data.isMore,
                total: cachedData.data.total,
              }));
            } else {
              setRepliesData(cachedData.data);
            }
            return;
          }
        }

        // Fetch from API
        const response = await getComments(
          {
            questionId: comment.itemId,
            parentId: comment._id,
            limit,
            offset,
            sort: "asc",
          },
          signal
        );

        if (!response || response.statusCode !== 200) {
          throw new Error(response?.message || "Failed to load replies");
        }

        // Update cache
        repliesCache.current.set(cacheKey, {
          data: {
            comments: response.metadata.comments,
            isMore: response.metadata.isMore,
            total: response.metadata.total,
          },
          timestamp: now,
        });

        // Update state based on whether we're loading more or refreshing
        if (isLoadMore) {
          setRepliesData((prev) => ({
            comments: processReplies([
              ...prev.comments,
              ...response.metadata.comments,
            ]),
            isMore: response.metadata.isMore,
            total: response.metadata.total,
          }));
        } else {
          setRepliesData({
            comments: processReplies(response.metadata.comments),
            isMore: response.metadata.isMore,
            total: response.metadata.total,
          });
        }
      } catch (error) {
        // Don't show error for aborted requests
        if (error.name !== "AbortError") {
          pushToast(
            "Không thể tải phản hồi: " +
              (error.message || "Lỗi không xác định"),
            "error"
          );
        }
      } finally {
        setIsLoadingReplies(false);
        setIsRefreshing(false);
      }
    },
    [comment, limit, processReplies, cancelPendingRequests, isOptimistic]
  );

  // Load more replies
  const handleLoadMore = useCallback(() => {
    if (isLoadingReplies || !repliesData.isMore) return;
    const newOffset = offset + limit;
    setOffset(newOffset);
    fetchReplies(newOffset, true);
  }, [offset, limit, repliesData.isMore, isLoadingReplies, fetchReplies]);

  // Handle open/close replies with loading on first open
  const handleToggleReplies = useCallback(() => {
    setOpen((prev) => !prev);

    // If opening for the first time, load replies
    if (!open && !hasLoadedInitialReplies.current) {
      fetchReplies(0, false, true);
      hasLoadedInitialReplies.current = true;
    }
  }, [open, fetchReplies]);

  // Handle refresh with debounce
  const handleRefresh = useCallback(() => {
    if (isRefreshing) {
      pushToast("Đang tải lại phản hồi...", "info");
      return;
    }

    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    setIsRefreshing(true);
    refreshTimeoutRef.current = setTimeout(() => {
      setOffset(0);
      fetchReplies(0, false, true);
      refreshTimeoutRef.current = null;
    }, 300);
  }, [isRefreshing, fetchReplies]);

  // Submit a new reply with optimistic update
  const onSubmit = useCallback(
    async (data) => {
      if (!data.content?.trim()) {
        pushToast("Nội dung không được để trống!", "error");
        return;
      }

      try {
        setIsPostingReply(true);

        // Create an optimistic reply
        const optimisticId = `temp-${Date.now()}`;
        const optimisticReply = {
          _id: optimisticId,
          itemId: comment.itemId,
          parentId: comment._id,
          user: { ...user },
          content: data.content.trim(),
          createdAt: new Date().toISOString(),
          _isOptimistic: true,
        };

        // Update UI immediately
        setRepliesData((prev) => ({
          ...prev,
          comments: [...prev.comments, optimisticReply],
          total: prev.total + 1,
        }));

        // Reset form
        reset();

        // Send to server
        const res = await postComment({
          content: data.content.trim(),
          questionId: comment.itemId,
          parentId: comment._id,
        });

        if (res.statusCode !== 200) {
          throw new Error(res.message || "Failed to post reply");
        }

        // Refresh comments to get the actual reply
        fetchReplies(0, false, true);
      } catch (error) {
        // Remove optimistic reply on error
        setRepliesData((prev) => ({
          ...prev,
          comments: prev.comments.filter((c) => !c._isOptimistic),
          total: Math.max(0, prev.total - 1),
        }));
        pushToast(
          "Không thể đăng phản hồi: " + (error.message || "Lỗi không xác định"),
          "error"
        );
      } finally {
        setIsPostingReply(false);
      }
    },
    [comment, user, reset, fetchReplies]
  );

  const onError = useCallback((errors) => {
    Object.values(errors).forEach((error) => {
      toast.error(error.message);
    });
  }, []);

  // Initial load and cleanup
  useEffect(() => {
    // Only fetch initial replies if the comment is expanded
    if (open && !comment.parentId && !hasLoadedInitialReplies.current) {
      fetchReplies(0);
      hasLoadedInitialReplies.current = true;
    }

    return () => {
      cancelPendingRequests();
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [open, comment.parentId, fetchReplies, cancelPendingRequests]);

  // Loading and empty states
  const isLoading = isRefreshing && offset === 0;
  const isEmpty = !isLoading && replies.length === 0;
  const isSubmitDisabled = isPostingReply || !replyContent?.trim();

  return (
    <Box sx={{ ...commentStyle(theme), opacity: isOptimistic ? 0.7 : 1 }}>
      {comment?.user?.avatar ? (
        <Avatar src={comment?.user?.avatar} className={"comment-avatar"} />
      ) : (
        <Avatar className={"comment-avatar"} />
      )}
      <Box
        sx={{
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            backgroundColor: theme.palette.questionBackground.primary,
            padding: 1,
            borderRadius: 2,
            width: "fit-content",
          }}
        >
          <Typography variant="body1" fontWeight={700}>
            {comment?.user?.fullName}
            {isOptimistic && (
              <Typography
                component="span"
                variant="caption"
                sx={{ ml: 1, fontStyle: "italic", color: "text.secondary" }}
              >
                (Đang gửi...)
              </Typography>
            )}
          </Typography>
          <Typography variant="body2" color={"text.primary"}>
            {comment?.content}
          </Typography>
        </Box>

        <Box
          sx={{
            marginY: 0.5,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <Typography variant="caption" color={"text.secondary"}>
            {timeAgo}
          </Typography>
          {!comment.parentId && !isOptimistic && (
            <Button
              variant="text"
              sx={{
                fontSize: "12px",
                minWidth: 0,
                paddingX: 1,
                paddingY: 0.5,
              }}
              onClick={handleToggleReplies}
              disabled={isLoadingReplies}
            >
              <Icon as={BsReply} />
              Trả lời {repliesData.total > 0 && `(${repliesData.total})`}
            </Button>
          )}
        </Box>
        {!comment.parentId && !isOptimistic && (
          <Collapse in={open}>
            <Box sx={{ pl: 2 }}>
              {isLoading ? (
                <Typography variant="body2" sx={{ textAlign: "left", my: 1 }}>
                  Đang tải phản hồi...
                </Typography>
              ) : isEmpty ? (
                <Typography variant="body2" sx={{ textAlign: "left", my: 1 }}>
                  Chưa có phản hồi nào.
                </Typography>
              ) : (
                <>
                  {replies.map((reply) => (
                    <Comment
                      key={reply._id}
                      comment={reply}
                      isOptimistic={reply._isOptimistic}
                    />
                  ))}

                  {isLoadingReplies && (
                    <Typography
                      variant="body2"
                      sx={{ textAlign: "left", my: 1 }}
                    >
                      Đang tải thêm phản hồi...
                    </Typography>
                  )}
                </>
              )}
            </Box>

            {replies.length > 0 && (
              <Box sx={{ display: "flex", gap: 1, ml: 1 }}>
                {repliesData.isMore && (
                  <Button
                    variant="text"
                    sx={{
                      fontSize: "12px",
                      minWidth: 0,
                      paddingX: 1,
                      paddingY: 0.5,
                    }}
                    onClick={handleLoadMore}
                    disabled={isLoadingReplies}
                  >
                    {isLoadingReplies ? "Đang tải..." : "Xem thêm"}
                  </Button>
                )}
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
            )}

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
                    placeholder={"Trả lời..."}
                    {...register("content", {
                      required: "Không thể để trống!",
                    })}
                    autoComplete={"off"}
                    disabled={isPostingReply}
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
          </Collapse>
        )}
      </Box>
    </Box>
  );
}

export default memo(Comment);
