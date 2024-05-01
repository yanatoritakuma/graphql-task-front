import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Task } from "../types/task";
import { TaskStatus } from "../types/taskStatus";
import { useMutation } from "@apollo/client";
import { UPDATE_TASK } from "../mutations/taskMutations";
import { GET_TASKS } from "../queries/taskQueries";
import { useNavigate } from "react-router-dom";

export default function EditTask({
  task,
  userId,
}: {
  task: Task;
  userId: number;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(task.name);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [status, setStatus] = useState(task.status);
  const [description, setDescription] = useState(task.description);
  const [isInvalidName, setIsInvalidName] = useState(false);
  const [isInvalidDueDate, setIsInvalidDueDate] = useState(false);
  const navigate = useNavigate();

  const [upDateTask] = useMutation<{ updateTask: Task }>(UPDATE_TASK);

  const restState = () => {
    setName(task.name);
    setDueDate(task.dueDate);
    setStatus(task.status);
    setDescription(task.description);
    setIsInvalidName(false);
    setIsInvalidDueDate(false);
  };

  const handleEditTask = async () => {
    let canEdit = true;

    if (name.length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      canEdit = false;
      setIsInvalidName(true);
    } else {
      setIsInvalidName(false);
    }

    if (!Date.parse(dueDate)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      canEdit = false;
      setIsInvalidDueDate(true);
    } else {
      setIsInvalidDueDate(false);
    }

    if (canEdit) {
      const updateTaskInput = {
        id: task.id,
        name,
        dueDate,
        status,
        description,
      };

      try {
        await upDateTask({
          variables: { updateTaskInput },
          refetchQueries: [{ query: GET_TASKS, variables: { userId } }],
        });
        restState();
        setOpen(false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.message === "Unauthorized") {
          localStorage.removeItem("token");
          alert("トークンの有効期限がきれました。");
          navigate("/signin");
          return;
        }

        alert("タスクの編集に失敗");
      }
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    restState();
  };

  return (
    <div>
      <Tooltip title="編集">
        <IconButton onClick={handleClickOpen}>
          <EditIcon color="action" />
        </IconButton>
      </Tooltip>
      <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={handleClose}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="normal"
            id="name"
            label="Task Name"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={isInvalidName}
            helperText={isInvalidName && "タスク名を入力してください"}
          />
          <TextField
            autoFocus
            margin="normal"
            id="due-date"
            label="Due Date"
            placeholder="yyyy-mm-dd"
            fullWidth
            required
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            error={isInvalidDueDate}
            helperText={isInvalidDueDate && "日付形式で入力してください"}
          />
          <FormControl fullWidth={true} margin="normal">
            <InputLabel id="task-status-label">Status</InputLabel>
            <Select
              labelId="ask-status-label"
              id="task-status"
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
            >
              <MenuItem value={"NOT_STARTED"}>Not Started</MenuItem>
              <MenuItem value={"IN_PROGRESS"}>In Progress</MenuItem>
              <MenuItem value={"COMPLETED"}>Completed</MenuItem>
            </Select>
          </FormControl>
          <TextField
            autoFocus
            margin="normal"
            id="description"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleEditTask}>Update</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
