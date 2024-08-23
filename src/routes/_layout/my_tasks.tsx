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

import { TasksService } from "../../client";
import ActionsMenu from "../../components/Common/ActionsMenu";
//import Navbar from "../../components/Common/Navbar"
//import AddTask from "../../components/Tasks/AddTask"

const MyTasksSearchSchema = z.object({
  page: z.number().catch(1),
});

export const Route = createFileRoute("/_layout/my_tasks")({
  component: MyTasks,
  validateSearch: (search) => MyTasksSearchSchema.parse(search),
});

const PER_PAGE = 5;

function getTasksQueryOptions({ page }: { page: number }) {
  return {
    queryFn: () =>
      TasksService.readTasks({ skip: (page - 1) * PER_PAGE, limit: PER_PAGE }),
    queryKey: ["Tasks", { page }],
  };
}

function MyTasksTable() {
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
              {Tasks?.data.map((Task: any, index: number) => (
                <Tr key={index} opacity={isPlaceholderData ? 0.5 : 1}>
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
                    <ActionsMenu type={"MyTasks"} value={Task} />
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

function MyTasks() {
  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: "center", md: "left" }} pt={12}>
        My Tasks
      </Heading>

      <MyTasksTable />
    </Container>
  );
}
