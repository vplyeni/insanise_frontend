import {
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import FieldTask from "./FieldTask";
import useCustomToast from "../../hooks/useCustomToast";

interface AddTaskProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTaskModal = ({ isOpen, onClose }: AddTaskProps) => {
  const [fields, setFields] = useState<any[]>([]);
  const [task, setTask] = useState<any>({});

  const showToast = useCustomToast();

  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("");

  const removeArea = (index: number) => {
    if (index >= 0 && index < fields.length) {
      const ls = [...fields.slice(0, index), ...fields.slice(index + 1)];
      setFields(ls);
    }
  };

  const onCancel = () => {
    onClose();
  };

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
          <ModalHeader>Add Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Flex
              style={{
                marginBottom: "10px",
              }}
            >
              <Input
                onChange={(event) => {
                  console.log(event.target);
                  const text: string = event.target.value;
                  const last = text
                    .split("-")
                    .reverse()
                    .reduce((a, b) => a + "-" + b);
                  task["due_date"] = last;
                  setTask(task);
                }}
                placeholder="Due Date"
                type="date"
                maxW={"250px"}
              />
              <Text
                textAlign="center"
                style={{
                  marginLeft: "20px",
                  color: "#00000066",
                  marginTop: "5px",
                }}
              >
                Due Date
              </Text>
            </Flex>
            <Input
              onChange={(event) => {
                const text = event.target.value;
                console.log(text);
                task["name"] = text;
                setTask(task);
              }}
              placeholder={"Task name"}
            />
            <Textarea
              placeholder={"Description"}
              onChange={(event) => {
                const text = event.target.value;
                task["description"] = text;
                setTask(task);
              }}
              style={{
                marginTop: "10px",
                minHeight: "120px",
              }}
            />
            {fields.map((field, index) => {
              return (
                <FieldTask
                  key={index}
                  removeTask={removeArea}
                  field={field}
                  index={index}
                />
              );
            })}
            <Flex
              style={{
                marginTop: "10px",
              }}
            >
              <Input
                maxW={"250px"}
                placeholder="Field Name"
                value={newName}
                onChange={(event) => {
                  const text = event.target.value;
                  setNewName(text);
                }}
              ></Input>
              <Select
                maxW={"250px"}
                placeholder="Select option"
                value={newType}
                onChange={(event) => {
                  const text = event.target.value;
                  setNewType(text);
                }}
                style={{
                  marginLeft: "10px",
                  minWidth: "150px",
                }}
              >
                <option value="plain_text">Plain Text</option>
                <option value="long_text">Long Text</option>
                <option value="file-png,jpeg,jpg">Photo</option>
                <option value="file-zip">Zip</option>
                <option value="file-pdf">Pdf</option>
                <option value="file">File</option>
              </Select>
              <Button
                style={{
                  marginLeft: "20px",
                  minWidth: "120px",
                }}
                onClick={() => {
                  if (newType && newName) {
                    setFields([
                      ...fields,
                      {
                        type: newType,
                        name: newName,
                        content: "",
                        representedName: "",
                      },
                    ]);
                    setNewName("");
                    setNewType("");
                  } else {
                    showToast(
                      "Error",
                      "Please fill, name and type properly",
                      "error"
                    );
                  }
                }}
              >
                Add Field
              </Button>
            </Flex>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="primary">Save</Button>
            <Button onClick={onCancel}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default AddTaskModal;
