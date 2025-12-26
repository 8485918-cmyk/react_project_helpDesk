import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField
} from "@mui/material";
import { useState } from "react";
import { api } from "../api/api";

interface AddStatusDialogProps {
    open: boolean;
    onClose: () => void;
    onCreated?: () => void;
}

const AddStatusDialog = ({ open, onClose, onCreated }: AddStatusDialogProps) => {
    const [name, setName] = useState("");

    const handleCreate = async () => {
        try {
            await api("/statuses", {
                method: "POST",
                body: JSON.stringify({ name })
            });
            setName("");
            onClose();
            onCreated?.();
        } catch (error) {
            console.error("Failed to create status:", error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Create Status</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    fullWidth
                    label="Status name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleCreate} variant="contained">
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddStatusDialog;
