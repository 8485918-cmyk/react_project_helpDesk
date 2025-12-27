import { type FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import { createTicket } from "../../api/ticketService";
import { Box, Card, CardContent, Typography, Button, MenuItem, TextField, Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useForm } from "react-hook-form";
import '../../styles/tickets.css';
import { useMeta } from "../../context/metaContext";

interface NewTicketProps { }

interface NewTicketForm {
    subject: string;
    description: string;
    priority_id: number;
}

const NewTicket: FunctionComponent<NewTicketProps> = () => {

    const navigate = useNavigate();
    const theme = useTheme();

    const { priorities } = useMeta();

    const { register,
        handleSubmit,
        formState: { errors }
    } = useForm<NewTicketForm>({
        defaultValues: {
            priority_id: 2
        }
    });

    const onSubmit = async (data: NewTicketForm) => {
        try {
            await createTicket(data);
            navigate("/dashboard/tickets");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Container maxWidth="sm">
            <Card
                sx={{
                    mt: 2,
                    borderRadius: 3,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    border: `1px solid ${theme.palette.divider}`,
                }}
            >
                <CardContent sx={{ p: 4 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            mb: 3,
                            fontWeight: 700,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        ✏️ Create New Ticket
                    </Typography>

                    <Box
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2.5,
                        }}
                    >
                        <TextField
                            label="Ticket Subject"
                            fullWidth
                            variant="outlined"
                            {...register("subject", {
                                required: "יש למלא נושא",
                                minLength: {
                                    value: 3,
                                    message: "הנושא חייב להכיל לפחות 3 תוים"
                                }
                            })}
                            error={!!errors.subject}
                            helperText={errors.subject?.message}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                        />

                        <TextField
                            label="Ticket Description"
                            fullWidth
                            multiline
                            rows={5}
                            variant="outlined"
                            {...register("description", {
                                required: "יש למלא תיאור",
                                minLength: {
                                    value: 5,
                                    message: "תיאור קצר מידי"
                                }
                            })}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                        />

                        <TextField
                            select
                            label="Priority Level"
                            fullWidth
                            variant="outlined"
                            {...register("priority_id")}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                        >
                            <MenuItem value="">All Priorities</MenuItem>
                            {priorities.map(priority => (
                                <MenuItem key={priority.id} value={priority.id}>
                                    {priority.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            sx={{
                                mt: 2,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '1rem',
                                py: 1.5,
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 24px rgba(30, 58, 138, 0.2)',
                                }
                            }}
                        >
                            🎟️ Create Ticket
                        </Button>

                        <Button
                            variant="text"
                            onClick={() => navigate("/dashboard/tickets")}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                color: theme.palette.text.secondary,
                                '&:hover': {
                                    backgroundColor: 'rgba(30, 58, 138, 0.04)'
                                }
                            }}
                        >
                            ← Back to Tickets
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};


export default NewTicket;