import { useQuery } from "@apollo/client";
import Header from "./Header";
import TaskTable from "./TaskTable";
import { Task } from "../types/task";
import { GET_TASKS } from "../queries/taskQueries";
import Loading from "./Loading";
import { Stack, Typography } from "@mui/material";
import AddTask from "./AddTask";

const Main = () => {
  const token = localStorage.getItem("token");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const decodeJWT = (token: string): { [key: string]: any } | null => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(
            (c: string) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
          )
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Failed to decode JWT token:", error);
      return null;
    }
  };

  const decodedToken = decodeJWT(token!);
  const userId = decodedToken?.sub;

  const { loading, data, error } = useQuery<{ getTasks: Task[] }>(GET_TASKS, {
    variables: { userId },
  });

  return (
    <>
      <Header />
      <Stack spacing={4} direction="column" m={8} alignItems="center">
        {loading && <Loading />}
        {error && <Typography color="red">エラーが発生</Typography>}
        {!loading && !error && (
          <>
            <AddTask userId={userId} />
            <TaskTable tasks={data?.getTasks} userId={userId} />
          </>
        )}
      </Stack>
    </>
  );
};

export default Main;
