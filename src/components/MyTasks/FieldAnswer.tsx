import {
  Box,
  Card,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Spacer,
  Text,
  Textarea,
  useQuery,
  Spinner,
} from "@chakra-ui/react";
import { TaskField, TasksService, TDataFileForField } from "../../client";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { log } from "console";

interface FieldAnswer {
  task_id: string;
  field: TaskField;
  index: number;
  textareas: any;
  setTextareas: any;
}

const to_date_string = (date: Date) => {
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // 24-hour format
  });
};

const FieldAnswer = ({
  task_id,
  field,
  index,
  textareas,
  setTextareas,
}: FieldAnswer) => {
  const [isChanging, setIsChanging] = useState(false);
  const [dateString, setDateString] = useState(
    to_date_string(new Date(field.updated_at))
  );
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(field.represented_name);
  const [inputValue, setInputValue] = useState(field.content);
  const [debouncedValue, setDebouncedValue] = useState(inputValue);

  const baseStyle = {
    paddingTop: "10px",
    paddingRight: "10px",
    paddingLeft: "10px",
    border: "#FFFFFF30",
    marginTop: "10px",
    transition: "background-color 0.5s ease", // Transition effect
  };

  const loadingStyle = {
    ...baseStyle,
    backgroundColor: "#FFFF0010",
  };

  const loadedStyle = {
    ...baseStyle,
    backgroundColor: "#FF00FF10",
  };

  const emptyStyle = {
    ...baseStyle,
    backgroundColor: "#FF000010",
  };

  const currentStyle =
    field.content.length === 0
      ? emptyStyle
      : isLoading || isChanging
        ? loadingStyle
        : loadedStyle;

  if (field.type === "plain_text" || field.type === "long_text") {
    useEffect(() => {
      const handler = setTimeout(() => {
        setIsChanging(false);
        setDebouncedValue(inputValue);
      }, 1200); // Delay in milliseconds

      // Clean up the timeout if the user is still typing
      return () => {
        clearTimeout(handler);
      };
    }, [inputValue]);

    useEffect(() => {
      textareas[field.id] = debouncedValue;
      setTextareas(textareas);
      setIsLoading(true);
      mutation.mutate(debouncedValue);
      console.log("User finished typing:", debouncedValue);
    }, [debouncedValue]);
  }

  const mutation = useMutation({
    mutationFn: (text: string) =>
      TasksService.customizeFieldWithTaskId({
        content: text,
        task_id: task_id,
        field_id: field.id,
      }),
    retry: 3,
    onSuccess: (result: any, variables, context) => {
      console.log(result);

      console.log(to_date_string(new Date(result.updated_at)));
      setDateString(to_date_string(new Date(result.updated_at)));
      setIsLoading(false);
    },
  });

  return (
    <div key={index}>
      {field.type == "plain_text" ? (
        <Card style={currentStyle}>
          <Input
            background={"#00000000"}
            placeholder={field.name}
            defaultValue={field.content}
            onChange={(event) => {
              const text = event.target.value;
              textareas[field.id] = text;
              setIsChanging(true);
              setInputValue(text);
            }}
          />

          <div
            style={{
              display: "grid",
              width: "100%",
              justifyContent: "end",
              paddingTop: "10px",
              paddingBottom: "10px",
            }}
          >
            {isChanging || isLoading ? <Spinner /> : dateString}
          </div>
        </Card>
      ) : field.type == "long_text" ? (
        <Card style={currentStyle}>
          <Textarea
            background={"#00000000"}
            placeholder={field.name}
            defaultValue={field.content}
            onChange={(event) => {
              const text = event.target.value;
              textareas[field.id] = text;
              setIsChanging(true);
              setInputValue(text);
            }}
            style={{
              minHeight: "120px",
            }}
          />
          <div
            style={{
              display: "grid",
              width: "100%",
              justifyContent: "end",
              paddingTop: "10px",
              paddingBottom: "10px",
            }}
          >
            {isChanging || isLoading ? <Spinner /> : dateString}
          </div>
        </Card>
      ) : (
        <Card
          marginTop={"10px"}
          paddingTop={"6px"}
          padding={"10px"}
          defaultValue={field.name}
          minHeight={"100px"}
          borderColor={"#A0AEC0"}
          style={
            field.represented_name === ""
              ? {}
              : { backgroundColor: "#f3702420" }
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
              type="file"
              style={{
                color: "transparent",
                width: "150px",
                paddingTop: "5px",
              }}
              borderColor={"#A0AEC000"}
              _hover={{ borderColor: "#f3702400" }}
              onChange={(input) => {
                if (
                  input &&
                  input.target &&
                  input.target.files &&
                  input.target.files.length > 0
                ) {
                  TasksService.addFileToField({
                    task_id: task_id,
                    field_id: field.id,
                    file: input.target.files[0],
                  } as TDataFileForField).then((res: any) => {
                    field.content = res.name;
                    field.represented_name = res.represent_name;
                    setName(res.represent_name);
                  });
                }
              }}
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
            <Spacer></Spacer>
            {isChanging || isLoading ? <Spinner /> : <Text>{dateString}</Text>}
          </Flex>
        </Card>
      )}
    </div>
  );
};
export default FieldAnswer;
