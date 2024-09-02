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

import { TargetGroupBase, TargetGroupsService } from "../../client";
import Navbar from "../../components/Common/Navbar";
import ActionsMenu from "../../components/Common/ActionsMenu";
//import Navbar from "../../components/Common/Navbar"
//import AddTargetGroup from "../../components/TargetGroups/AddTargetGroup"

const TargetGroupsSearchSchema = z.object({
  page: z.number().catch(1),
});

export const Route = createFileRoute("/_layout/target_groups")({
  component: TargetGroups,
  validateSearch: (search) => TargetGroupsSearchSchema.parse(search),
});

const PER_PAGE = 5;

function getTargetGroupsQueryOptions({ page }: { page: number }) {
  return {
    queryFn: () =>
      TargetGroupsService.readTargetGroups({
        skip: (page - 1) * PER_PAGE,
        limit: PER_PAGE,
      }),
    queryKey: ["teams", { page }],
  };
}

function TargetGroupsTable() {
  const queryClient = useQueryClient();
  const { page } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const setPage = (page: number) =>
    navigate({ search: (prev) => ({ ...prev, page }) });

  const {
    data: TargetGroups,
    isPending,
    isPlaceholderData,
  } = useQuery({
    ...getTargetGroupsQueryOptions({ page }),
    placeholderData: (prevData) => prevData,
  });

  const hasNextPage =
    !isPlaceholderData && TargetGroups?.data.length === PER_PAGE;
  const hasPreviousPage = page > 1;

  useEffect(() => {
    if (hasNextPage) {
      queryClient.prefetchQuery(
        getTargetGroupsQueryOptions({ page: page + 1 })
      );
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
              {TargetGroups?.data.map((TargetGroup: TargetGroupBase) => (
                <Tr key={TargetGroup.id} opacity={isPlaceholderData ? 0.5 : 1}>
                  <Td isTruncated maxWidth="150px">
                    {TargetGroup.name}
                  </Td>
                  <Td
                    color={!TargetGroup.description ? "ui.dim" : "inherit"}
                    isTruncated
                    maxWidth="150px"
                  >
                    {TargetGroup.description || "N/A"}
                  </Td>
                  <Td>
                    <ActionsMenu type="TargetGroup" value={TargetGroup} />
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

function TargetGroups() {
  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: "center", md: "left" }} pt={12}>
        Target Groups Management
      </Heading>
      <TargetGroupsTable />
    </Container>
  );
}
