import { IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMutation } from "@apollo/client";
import { DELETE_TASK } from "../mutations/taskMutations";
import { GET_TASKS } from "../queries/taskQueries";
import { useNavigate } from "react-router-dom";

const DeleteTask = ({ id, userId }: { id: number; userId: number }) => {
  const [deleteTask] = useMutation<{ deleteTask: number }>(DELETE_TASK);
  const navigate = useNavigate();

  const hanedleDeleteTask = async () => {
    try {
      await deleteTask({
        variables: { id },
        refetchQueries: [{ query: GET_TASKS, variables: { userId } }],
      });
      alert("タスクが削除されました。");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.message === "Unauthorized") {
        localStorage.removeItem("token");
        alert("トークンの有効期限が切れました。");
        navigate("/signin");
        return;
      }
      alert("タスクの削除に失敗しました。");
    }
  };

  return (
    <div>
      <Tooltip title="削除">
        <IconButton onClick={hanedleDeleteTask}>
          <DeleteIcon color="action" />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default DeleteTask;
