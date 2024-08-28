import {
  Box,
  Button,
  Center,
  Checkbox,
  Divider,
  Flex,
  Input,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Spinner,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import FieldTask from "./FieldTask";
import useCustomToast from "../../hooks/useCustomToast";
import { ApiError, TaskBase, TasksService, UsersService } from "../../client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleError } from "../../utils";

interface AssignTaskProps {
  isOpen: boolean;
  onClose: () => void;
}

const AssignTask = ({ isOpen, onClose }: AssignTaskProps) => {
  const showToast = useCustomToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const reset = () => {};

  const onCancel = () => {
    onClose();
  };

  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
    // Replace this with your API call or search logic

    UsersService.searchUser({
      skip: 5,
      limit: 0,
      request_body: {
        search: "Alp",
        selected_employees: [1],
      },
    });
    const mockResults = ["Item 1", "Item 2", "Item 3", "Item 4"].filter(
      (item) => item.toLowerCase().includes(e.target.value.toLowerCase())
    );
    console.log();

    setResults(mockResults);
  };

  const handleSelect = (item: any) => {
    setSelectedItems((prev: any) =>
      prev.includes(item)
        ? prev.filter((i: any) => i !== item)
        : [...prev, item]
    );
  };

  const mutation = useMutation({
    mutationFn: (data: TaskBase) =>
      TasksService.createTask({ requestBody: data }),
    onSuccess: () => {
      showToast("Success!", "Item created successfully.", "success");
      reset();
      onClose();
    },
    onError: (err: ApiError) => {
      handleError(err, showToast);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
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
            <Input
              placeholder="Search Employee.."
              value={searchTerm}
              onChange={handleSearch}
              mb={4}
            />
            <Divider></Divider>
            {selectedItems.length > 0 && <Divider></Divider>}
            <Box marginTop={"10px"} overflowY="auto" maxH="300px">
              {results.map((result, index) => (
                <Box
                  borderBottom="2px solid"
                  marginBottom={"5px"}
                  borderColor="#ffffff10"
                  borderRadius={"10px"}
                  paddingLeft={"15px"}
                  minH={"50px"}
                  transition="background-color 0.3s ease"
                  _hover={{ bg: "#70707030" }}
                >
                  <div
                    onClick={() => {
                      console.log(result);
                    }}
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      paddingTop: "5px",
                      minHeight: "40px",
                      justifyItems: "center",
                      alignContent: "center",
                    }}
                  >
                    {result}
                  </div>
                </Box>
              ))}
            </Box>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button
              _hover={{ backgroundColor: "#FF1002" }}
              vaiant={"primary"}
              onClick={onCancel}
            >
              Assign
            </Button>
            <Button onClick={onCancel}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default AssignTask;
