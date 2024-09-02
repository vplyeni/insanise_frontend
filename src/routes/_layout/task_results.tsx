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

const TaskResultsSearchSchema = z.object({
  page: z.number().catch(1),
});

export const Route = createFileRoute("/_layout/task_results")({
  component: TaskResults,
  validateSearch: (search) => TaskResultsSearchSchema.parse(search),
});

const PER_PAGE = 5;

function getTaskResultsQueryOptions({ page }: { page: number }) {
  return {
    queryFn: () =>
      TasksService.readAllTasks({
        skip: (page - 1) * PER_PAGE,
        limit: PER_PAGE,
      }),
    queryKey: ["task_results", { page }],
  };
}

function TaskResultsTable() {
  const queryClient = useQueryClient();
  const { page } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const setPage = (page: number) =>
    navigate({ search: (prev) => ({ ...prev, page }) });

  const {
    data: TaskResults,
    isPending,
    isPlaceholderData,
  } = useQuery({
    ...getTaskResultsQueryOptions({ page }),
    placeholderData: (prevData) => prevData,
  });

  const hasNextPage =
    !isPlaceholderData && TaskResults?.data.length === PER_PAGE;
  const hasPreviousPage = page > 1;

  useEffect(() => {
    if (hasNextPage) {
      queryClient.prefetchQuery(getTaskResultsQueryOptions({ page: page + 1 }));
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
              {TaskResults?.data.map((TaskResult: TaskBase) => (
                <Tr key={TaskResult.id} opacity={isPlaceholderData ? 0.5 : 1}>
                  <Td isTruncated maxWidth="150px">
                    {TaskResult.name}
                  </Td>
                  <Td
                    color={!TaskResult.description ? "ui.dim" : "inherit"}
                    isTruncated
                    maxWidth="150px"
                  >
                    {TaskResult.description || "N/A"}
                  </Td>
                  <Td>{TaskResult.status}</Td>
                  <Td>
                    {TaskResult.task_period > 1440 ? (
                      <>
                        {(
                          (TaskResult.task_period -
                            (TaskResult.task_period % 1440)) /
                          1440
                        ).toFixed(0)}{" "}
                        Days
                      </>
                    ) : (
                      <></>
                    )}
                    {((TaskResult.task_period - (TaskResult.task_period % 60)) /
                      60) %
                    24 ? (
                      <>
                        {" "}
                        {(
                          ((TaskResult.task_period -
                            (TaskResult.task_period % 60)) /
                            60) %
                          24
                        ).toFixed(0)}{" "}
                        Hours
                      </>
                    ) : (
                      <></>
                    )}

                    {TaskResult.task_period % 60 ? (
                      <> {TaskResult.task_period % 60} Minutes</>
                    ) : (
                      <></>
                    )}
                  </Td>
                  <Td>
                    <ActionsMenu type={"TaskResult"} value={TaskResult} />
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

function TaskResults() {
  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: "center", md: "left" }} pt={12}>
        Task Results
      </Heading>
      <TaskResultsTable />
    </Container>
  );
}
