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
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import FieldTask from "./FieldTask";
import useCustomToast from "../../hooks/useCustomToast";
import { ApiError, TaskBase, TasksService } from "../../client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleError } from "../../utils";

interface AddTaskProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTaskModal = ({ isOpen, onClose }: AddTaskProps) => {
  const [fields, setFields] = useState<any[]>([]);
  const [task, setTask] = useState<any>({});
  const [hour, setHour] = useState<any>(undefined);
  const [day, setDay] = useState<any>(undefined);

  const showToast = useCustomToast();
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("");

  const removeArea = (index: number) => {
    if (index >= 0 && index < fields.length) {
      const ls = [...fields.slice(0, index), ...fields.slice(index + 1)];
      setFields(ls);
    }
  };

  const reset = () => {
    setFields([]);
    setTask({});
    setHour(undefined);
    setDay(undefined);
    setNewName("");
    setNewType("");
  };

  const onCancel = () => {
    reset();
    onClose();
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
          <ModalHeader>Add Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Flex
              justify={"left"}
              style={{
                marginBottom: "10px",
              }}
              alignContent={"start"}
              verticalAlign={"center"}
            >
              <Text style={{ alignContent: "center", marginRight: "10px" }}>
                Days:
              </Text>
              <NumberInput
                placeholder="Day"
                value={day}
                defaultValue={undefined}
                step={1}
                min={0}
                max={30}
                onChange={(event) => {
                  if (event === "") {
                    setDay(0);
                    return 0;
                  }
                  const value = parseInt(event);
                  if (value > 30) {
                    setDay(30);
                    return 30 + "";
                  } else {
                    setDay(value);
                    return value + "";
                  }
                }}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <Text
                style={{
                  alignContent: "center",
                  marginLeft: "20px",
                  marginRight: "10px",
                }}
              >
                Hours:
              </Text>
              <NumberInput
                style={{ marginLeft: "10px" }}
                value={hour}
                placeholder="Hour"
                step={0.15}
                defaultValue={undefined}
                min={0}
                max={23.6}
                onChange={(event) => {
                  let value = 0;
                  if (event !== "") {
                    value = parseFloat(event);
                  }
                  let minute = Math.round((value % 1) * 100);

                  if (minute % 15 > 7.5) {
                    minute = minute + (15 - (minute % 15));
                  } else {
                    minute = minute + (minute % 15);
                  }

                  if (minute > 59) {
                    value = value - (value % 1) + minute / 100;
                    value = Math.round(value);
                  }

                  setHour(value.toFixed(2));
                }}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Flex>
            <Input
              defaultValue={task && task["name"] && task["name"]}
              onChange={(event) => {
                const text = event.target.value;
                console.log(text);
                task["name"] = text;
                setTask(task);
              }}
              placeholder={"Task name"}
            />
            <Textarea
              defaultValue={task && task["description"] && task["description"]}
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
                <option value="file-png,jpeg,jpg.">Photo</option>
                <option value="file-zip.">Zip</option>
                <option value="file-pdf.">Pdf</option>
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
            <Button
              variant="primary"
              onClick={() => {
                let data: TaskBase = task;
                let period = 0;
                if (day) {
                  period = 1440 * day;
                }
                if (hour) {
                  const hesap =
                    Math.round(hour - (hour % 1)) * 60 +
                    Math.round((hour % 1) * 100);
                  console.log(hesap);

                  period =
                    period +
                    Math.round(hour - (hour % 1)) * 60 +
                    Math.round((hour % 1) * 100);
                }
                console.log(hour);

                data.task_period = period;
                data.fields = fields;
                mutation.mutate(data);
              }}
            >
              Save
            </Button>
            <Button onClick={onCancel}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default AddTaskModal;
