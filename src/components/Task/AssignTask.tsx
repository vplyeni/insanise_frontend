import {
  Button,
  Collapse,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";

import useCustomToast from "../../hooks/useCustomToast";
import AssignByEmployee from "./AssignByEmployee";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  ApiError,
  TaskPublic,
  TasksService,
  TDataAssignTask,
  UserPublic,
} from "../../client";
import { handleError } from "../../utils";

interface AssignTaskProps {
  item: TaskPublic;
  isOpen: boolean;
  onClose: () => void;
}

const AssignTask = ({ item, isOpen, onClose }: AssignTaskProps) => {
  const showToast = useCustomToast();
  const queryClient = useQueryClient();
  const [areYouSure, setAreYouSure] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [assignText, setAssignText] = useState("Assign");
  const [debouncedValue, setDebouncedValue] = useState(assignText);
  const [selectedUsers, setSelectedUsers] = useState([] as UserPublic[]);
  const reset = () => {};

  const onCancel = () => {
    onClose();
  };
  const task_assingment_mutation = useMutation({
    mutationFn: (data: TDataAssignTask) => TasksService.assignTask(data),
    onError: (err: ApiError) => {
      showToast("Error", err.body + "", "error");
    },
    onSuccess: (e: any) => {
      showToast("Success", "Task Assigned Succesfully", "success");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      onClose();
    },
  });
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={{ base: "xl", md: "2xl" }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent as="form">
          <ModalHeader>Assign This Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody minH="300px" pb={6}>
            <Tabs>
              <TabList>
                <Tab>Employee</Tab>
                <Tab>Team</Tab>
                <Tab>Group</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <AssignByEmployee
                    selectedUsers={selectedUsers}
                    setSelectedUsers={setSelectedUsers}
                  />
                </TabPanel>
                <TabPanel>
                  <p>two!</p>
                </TabPanel>
                <TabPanel>
                  <p>three!</p>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button
              _hover={{
                backgroundColor: "#FF1002",
                width: "200px",
                transition:
                  "width 1s ease-in-out, background-color 0.5s ease-in-out", // You can adjust the timing
              }}
              width="150px" // Initial width
              transition="width 1s ease-in-out, background-color 0.5s ease-in-out" // Transition for non-hover states
              onMouseEnter={() => {
                setAssignText("Are You Sure?");
              }}
              onMouseLeave={() => {
                setAssignText("Assign");
              }}
              onClick={() => {
                task_assingment_mutation.mutate({
                  assigned_to: selectedUsers.map((i) => i.id),
                  task_id: item.id,
                });
              }}
            >
              {assignText}
            </Button>

            <Button onClick={onCancel}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default AssignTask;
