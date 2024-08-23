import {
  Box,
  Button,
  Card,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { TaskField, TasksService, TDataFileForField } from "../../client";
import { useState } from "react";
import { FiTrash } from "react-icons/fi";
import { IconButton } from "@chakra-ui/react";

interface FieldTask {
  removeTask: any;
  field: TaskField;
  index: number;
}

const FieldTask = ({ removeTask, field, index }: FieldTask) => {
  const [name, setName] = useState(field.represented_name);

  return (
    <Flex verticalAlign={"center"} key={index} style={{ marginTop: "10px" }}>
      <IconButton
        onClick={() => {
          removeTask(index);
        }}
        style={{ marginRight: "10px" }}
        aria-label="Delete"
        icon={<FiTrash />}
      />
      {field.type == "plain_text" ? (
        <Input
          isDisabled
          placeholder={field.name}
          defaultValue={field.content}
          onChange={(event) => {
            const text = event.target.value;
            console.log(text);
          }}
        />
      ) : field.type == "long_text" ? (
        <>
          <Textarea
            placeholder={field.name}
            defaultValue={field.content}
            onChange={(event) => {
              const text = event.target.value;
              console.log(text);
            }}
            style={{
              minHeight: "120px",
            }}
          />
        </>
      ) : (
        <Card
          padding={"10px"}
          defaultValue={field.name}
          minHeight={"100px"}
          borderColor={"#A0AEC0"}
          style={
            field.represented_name === "" || !field.represented_name
              ? { width: "100%" }
              : { width: "100%", backgroundColor: "#f3702420" }
          }
        >
          <FormLabel
            marginTop={"10px"}
            marginLeft={"20px"}
            fontSize="sm"
            color="gray.500"
          >
            {field.name}
          </FormLabel>
          <Flex alignItems="center">
            <Input
              isDisabled
              type="file"
              style={{
                color: "transparent",
                width: "150px",
                paddingTop: "5px",
              }}
              borderColor={"#A0AEC000"}
              _hover={{ borderColor: "#f3702400" }}
            />
            {name === "" ? (
              <Text isTruncated maxW={350}>
                No File Chosen
              </Text>
            ) : (
              <Text isTruncated maxW={350}>
                File: {name}
              </Text>
            )}
          </Flex>
        </Card>
      )}
    </Flex>
  );
};
export default FieldTask;
