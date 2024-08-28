import {
  Button,
  Container,
  Flex,
  Heading,
  SkeletonText,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { z } from "zod";

import { TaskBase, TasksService } from "../../client";
import AddTaskModal from "../../components/Task/AddTask";
import Navbar from "../../components/Common/Navbar";
import ActionsMenu from "../../components/Common/ActionsMenu";
//import Navbar from "../../components/Common/Navbar"
//import AddTask from "../../components/Tasks/AddTask"

const TasksSearchSchema = z.object({
  page: z.number().catch(1),
});

export const Route = createFileRoute("/_layout/tasks")({
  component: Tasks,
  validateSearch: (search) => TasksSearchSchema.parse(search),
});

const PER_PAGE = 5;

function getTasksQueryOptions({ page }: { page: number }) {
  return {
    queryFn: () =>
      TasksService.readAllTasks({
        skip: (page - 1) * PER_PAGE,
        limit: PER_PAGE,
      }),
    queryKey: ["tasks", { page }],
  };
}

function TasksTable() {
  const queryClient = useQueryClient();
  const { page } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const setPage = (page: number) =>
    navigate({ search: (prev) => ({ ...prev, page }) });

  const {
    data: Tasks,
    isPending,
    isPlaceholderData,
  } = useQuery({
    ...getTasksQueryOptions({ page }),
    placeholderData: (prevData) => prevData,
  });

  const hasNextPage = !isPlaceholderData && Tasks?.data.length === PER_PAGE;
  const hasPreviousPage = page > 1;

  useEffect(() => {
    if (hasNextPage) {
      queryClient.prefetchQuery(getTasksQueryOptions({ page: page + 1 }));
    }
  }, [page, queryClient, hasNextPage]);

  return (
    <>
      <TableContainer>
        <Table size={{ base: "sm", md: "md" }}>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Description</Th>
              <Th>Status</Th>
              <Th>Duration</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          {isPending ? (
            <Tbody>
              <Tr>
                {new Array(4).fill(null).map((_, index) => (
                  <Td key={index}>
                    <SkeletonText noOfLines={1} paddingBlock="16px" />
                  </Td>
                ))}
              </Tr>
            </Tbody>
          ) : (
            <Tbody>
              {Tasks?.data.map((Task: TaskBase) => (
                <Tr key={Task.id} opacity={isPlaceholderData ? 0.5 : 1}>
                  <Td isTruncated maxWidth="150px">
                    {Task.name}
                  </Td>
                  <Td
                    color={!Task.description ? "ui.dim" : "inherit"}
                    isTruncated
                    maxWidth="150px"
                  >
                    {Task.description || "N/A"}
                  </Td>
                  <Td>{Task.status}</Td>
                  <Td>
                    {Task.task_period > 1440 ? (
                      <>
                        {(
                          (Task.task_period - (Task.task_period % 1440)) /
                          1440
                        ).toFixed(0)}{" "}
                        Days
                      </>
                    ) : (
                      <></>
                    )}
                    {((Task.task_period - (Task.task_period % 60)) / 60) %
                    24 ? (
                      <>
                        {" "}
                        {(
                          ((Task.task_period - (Task.task_period % 60)) / 60) %
                          24
                        ).toFixed(0)}{" "}
                        Hours
                      </>
                    ) : (
                      <></>
                    )}

                    {Task.task_period % 60 ? (
                      <> {Task.task_period % 60} Minutes</>
                    ) : (
                      <></>
                    )}
                  </Td>
                  <Td>
                    <ActionsMenu type={"Task"} value={Task} />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          )}
        </Table>
      </TableContainer>
      <Flex
        gap={4}
        alignItems="center"
        mt={4}
        direction="row"
        justifyContent="flex-end"
      >
        <Button onClick={() => setPage(page - 1)} isDisabled={!hasPreviousPage}>
          Previous
        </Button>
        <span>Page {page}</span>
        <Button isDisabled={!hasNextPage} onClick={() => setPage(page + 1)}>
          Next
        </Button>
      </Flex>
    </>
  );
}

function Tasks() {
  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: "center", md: "left" }} pt={12}>
        Tasks Management
      </Heading>
      <Navbar type={"Task"} addModalAs={AddTaskModal} />
      <TasksTable />
    </Container>
  );
}
