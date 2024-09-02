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

import { UsersService, UserPublic } from "../../client";
import ActionsMenu from "../../components/Common/ActionsMenu";

const EmployeesSearchSchema = z.object({
  page: z.number().catch(1),
});

export const Route = createFileRoute("/_layout/employees")({
  component: Employees,
  validateSearch: (search) => EmployeesSearchSchema.parse(search),
});

const PER_PAGE = 5;

function getEmployeesQueryOptions({ page }: { page: number }) {
  return {
    queryFn: () =>
      UsersService.readEmployees({
        skip: (page - 1) * PER_PAGE,
        limit: PER_PAGE,
      }),
    queryKey: ["employees", { page }],
  };
}

function EmployeesTable() {
  const queryClient = useQueryClient();
  const { page } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const setPage = (page: number) =>
    navigate({ search: (prev) => ({ ...prev, page }) });

  const {
    data: Employees,
    isPending,
    isPlaceholderData,
  } = useQuery({
    ...getEmployeesQueryOptions({ page }),
    placeholderData: (prevData) => prevData,
  });

  const hasNextPage = !isPlaceholderData && Employees?.data.length === PER_PAGE;
  const hasPreviousPage = page > 1;

  useEffect(() => {
    if (hasNextPage) {
      queryClient.prefetchQuery(getEmployeesQueryOptions({ page: page + 1 }));
    }
  }, [page, queryClient, hasNextPage]);

  return (
    <>
      <TableContainer>
        <Table size={{ base: "sm", md: "md" }}>
          <Thead>
            <Tr>
              <Th>Name</Th>
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
              {Employees?.data.map((Employee: UserPublic, index: number) => (
                <Tr key={index} opacity={isPlaceholderData ? 0.5 : 1}>
                  <Td isTruncated maxWidth="150px">
                    {Employee.first_name + " " + Employee.last_name}
                  </Td>
                  <Td>
                    <ActionsMenu type={"Employee"} value={Employee} />
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

function Employees() {
  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: "center", md: "left" }} pt={12}>
        Employee Management
      </Heading>
      <EmployeesTable />
    </Container>
  );
}
