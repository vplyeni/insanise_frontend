import {
  Button,
  Container,
  Flex,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
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
import { FiSearch, FiX } from "react-icons/fi";

import { useEffect } from "react";
import { z } from "zod";

import { TaskBase, TaskResultPublic, TasksService } from "../../client";
import ActionsMenu from "../../components/Common/ActionsMenu";
import React from "react";
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

function getTaskResultsQueryOptions({
  page,
  search,
}: {
  page: number;
  search: string;
}) {
  return {
    queryFn: () =>
      TasksService.readTaskResults({
        skip: (page - 1) * PER_PAGE,
        limit: PER_PAGE,
        search: search,
      }),
    queryKey: ["task_results", { page }],
  };
}

interface TaskResultsProps {
  searchString: string;
}

function TaskResultsTable({ searchString }: TaskResultsProps) {
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
    ...getTaskResultsQueryOptions({ page, search: searchString }),
    placeholderData: (prevData) => prevData,
  });

  const hasNextPage =
    !isPlaceholderData && TaskResults?.data.length === PER_PAGE;
  const hasPreviousPage = page > 1;

  useEffect(() => {
    if (hasNextPage) {
      queryClient.prefetchQuery(
        getTaskResultsQueryOptions({ page: page + 1, search: searchString })
      );
    }
  }, [page, queryClient, hasNextPage]);

  return (
    <>
      <TableContainer>
        <Table size={{ base: "sm", md: "md" }}>
          <Thead>
            <Tr>
              <Th>User Full Name</Th>
              <Th>Name</Th>
              <Th>Description</Th>
              <Th>Due Date</Th>
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
              {TaskResults?.data.map(
                (TaskResult: TaskResultPublic, index: number) => (
                  <Tr key={index} opacity={isPlaceholderData ? 0.5 : 1}>
                    <Td>{TaskResult.user_full_name}</Td>
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
                    <Td>{TaskResult.due_date}</Td>
                  </Tr>
                )
              )}
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
  const [search, setSearch] = React.useState("");
  const queryClient = useQueryClient();
  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: "center", md: "left" }} pt={12}>
        Task Results
      </Heading>
      <Flex marginTop={"10px"} width={"300px"}>
        <InputGroup size="md">
          <Input
            value={search}
            pr="4.5rem"
            type={"text"}
            placeholder="User Full Name"
            onChange={(e) => setSearch(e.target.value)}
          />
          <InputRightElement justifyContent={"right"} width="4.5rem">
            <IconButton
              background={"#ff000000"}
              _hover={{ background: "#ff000000" }}
              aria-label=""
              margin={"0px"}
              onClick={() => {
                queryClient.invalidateQueries({ queryKey: ["task_results"] });
                setSearch("");
              }}
              icon={<FiX />}
            ></IconButton>
          </InputRightElement>
        </InputGroup>
        <IconButton
          marginLeft={"5px"}
          aria-label=""
          icon={<FiSearch />}
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: ["task_results"] })
          }
        ></IconButton>
      </Flex>
      <TaskResultsTable searchString={search} />
    </Container>
  );
}
