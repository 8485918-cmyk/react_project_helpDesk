import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
    Alert
} from "@mui/material";
import { useEffect, useState } from "react";
import { api } from "../api/api";

interface AddStatusDialogProps {
    open: boolean;
    onClose: () => void;
    onCreated?: () => void;
}

const AddStatusDialog = ({ open, onClose, onCreated }: AddStatusDialogProps) => {

    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);


    const handleCreate = async () => {
        try {

            setError(null);

            const res = await api("/statuses", {
                method: "POST",
                body: JSON.stringify({ name })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to create status");
            }

            setName("");
            onClose();
            onCreated?.();

        } catch (error) {
            console.error("Failed to create status:", error);
            setError("סטטוס כפול");
        }
    };

    useEffect(() => {
        if (!open) {
            setError(null);
            setName("");
        }
    }, [open]);



    return (
        <Dialog
            open={open}
            onClose={() => {
                setError(null);
                setName("");
                onClose();
            }}>

            <DialogTitle>Create Status</DialogTitle>

            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {error && (
                    <Alert severity="error" sx={{ borderRadius: 2 }}>
                        {error}
                    </Alert>
                )}

                <TextField
                    autoFocus
                    fullWidth
                    label="Status name"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        if (error) setError(null);
                    }}
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={() => {
                    setError(null);
                    setName("");
                    onClose();
                }}>Cancel</Button>
                <Button onClick={handleCreate} variant="contained">
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddStatusDialog;
