import { Button, CircularProgress, TextField, Typography, Paper } from "@mui/material";
import { Box } from "@mui/system";
import type { FunctionComponent } from "react";
import { useTheme } from "@mui/material/styles";
import { type Comment } from "../../types/Comment";

interface CommentsProps {
    ticketId: number;
    comments: Record<number, Comment[]>;
    loadingComments: Record<number, boolean>;
    newComment: Record<number, string>;
    assignedTo: number;
    setNewComment: React.Dispatch<React.SetStateAction<Record<number, string>>>;
    addComment: (ticketId: number) => void;
    currentUserRole?: "customer" | "agent" | "admin";
}

const Comments: FunctionComponent<CommentsProps> = ({
    ticketId,
    comments,
    loadingComments,
    newComment,
    assignedTo,
    setNewComment,
    addComment,
    currentUserRole,
}: CommentsProps) => {

    const canAddComment = currentUserRole != "admin";
    const theme = useTheme();

    return (
        <Box sx={{ mt: 3, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                💬 Comments
            </Typography>

            {loadingComments[ticketId] ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 3 }}>
                    <CircularProgress size={40} thickness={4} color="primary" />
                </Box>
            ) : comments[ticketId]?.length ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
                    {comments[ticketId]?.map((c) => {
                        const isAgent = c.author_id == assignedTo;
                        return (
                            <Paper
                                key={c.id}
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    backgroundColor: isAgent ? 'rgba(139, 92, 246, 0.05)' : 'rgba(30, 58, 138, 0.05)',
                                    borderLeft: `4px solid ${isAgent ? theme.palette.secondary.main : theme.palette.primary.main}`,
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                    }
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                            {c.author_name}
                                            {isAgent && <Typography component="span" sx={{ ml: 1, fontSize: '0.75rem', color: theme.palette.secondary.main, fontWeight: 600 }}>👨‍💼 Agent</Typography>}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                            {new Date(c.created_at).toLocaleString()}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography variant="body2" sx={{ color: '#1e293b', lineHeight: 1.6 }}>
                                    {c.content}
                                </Typography>
                            </Paper>
                        );
                    })}
                </Box>
            ) : (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, fontStyle: 'italic' }}>
                    📭 No comments yet
                </Typography>
            )}


            {canAddComment && (
                <Box sx={{ display: "flex", gap: 1, mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                    <TextField
                        size="small"
                        variant="outlined"
                        placeholder="Add a comment..."
                        value={newComment[ticketId] || ""}
                        onChange={(e) =>
                            setNewComment((prev) => ({
                                ...prev,
                                [ticketId]: e.target.value,
                            }))
                        }
                        multiline
                        rows={2}
                        sx={{
                            flex: 1,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                            }
                        }}
                    />
                    <Button
                        variant="contained"
                        onClick={() => addComment(ticketId)}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            alignSelf: 'flex-start',
                            mt: 0.5
                        }}
                    >
                        📤 Send
                    </Button>
                </Box>
            )}
        </Box>
    );
};


export default Comments;