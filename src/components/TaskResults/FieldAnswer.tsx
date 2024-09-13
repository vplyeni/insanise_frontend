import {
  Card,
  Flex,
  FormLabel,
  Input,
  Spacer,
  Text,
  Textarea,
  Spinner,
  IconButton,
} from "@chakra-ui/react";
import {
  ApiError,
  TaskField,
  TasksService,
  TDataFileForField,
} from "../../client";
import { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import { useMutation } from "@tanstack/react-query";
import useCustomToast from "../../hooks/useCustomToast";
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
  const [first, setFirst] = useState(true);
  const [isChanging, setIsChanging] = useState(false);
  const [dateString, setDateString] = useState(
    to_date_string(new Date(field.updated_at))
  );
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(field.represented_name);
  const [inputValue, setInputValue] = useState(field.content);
  const [debouncedValue, setDebouncedValue] = useState(inputValue);
  const showToast = useCustomToast();

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
    backgroundColor: "#f3702420",
  };

  const loadedStyle = {
    ...baseStyle,
    backgroundColor: "#00FF0015",
  };

  const emptyStyle = {
    ...baseStyle,
    backgroundColor: "#FF000020",
  };

  const currentStyle =
    debouncedValue.length === 0
      ? emptyStyle
      : isLoading || isChanging
        ? loadingStyle
        : loadedStyle;

  return (
    <div key={index}>
      {field.type == "plain_text" ? (
        <Card style={currentStyle}>
          <Input
            isDisabled
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
            {isChanging || isLoading ? <Spinner /> : "Saved: " + dateString}
          </div>
        </Card>
      ) : field.type == "long_text" ? (
        <Card style={currentStyle}>
          <Textarea
            isDisabled
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
            {isChanging || isLoading ? <Spinner /> : "Saved: " + dateString}
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
              : { backgroundColor: "#00ff0015" }
          }
        >
          <FormLabel
            marginTop={"10px"}
            marginLeft={"20px"}
            fontSize="sm"
            color="gray.500"
          >
            {field.name} (
            {field.type
              .replace("file-", " ")
              .split(",")
              .join(", ")
              .replace(".", " ")}
            )
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
              onChange={(input) => {
                if (
                  input &&
                  input.target &&
                  input.target.files &&
                  input.target.files.length > 0
                ) {
                  setIsLoading(true);
                  TasksService.addFileToField({
                    task_id: task_id,
                    field_id: field.id,
                    file: input.target.files[0],
                  } as TDataFileForField)
                    .then((res: any) => {
                      field.content = res.name;
                      field.represented_name = res.represent_name;
                      setName(res.represent_name);
                      console.log(res);

                      setDateString(to_date_string(new Date(res.updated_at)));
                      setIsLoading(false);
                    })
                    .catch((err: ApiError) => {
                      setIsLoading(false);
                      console.log(err.status);

                      if (err.status === 406) {
                        showToast(
                          "Error",
                          "File type is not supported for this field.",
                          "error"
                        );
                      } else {
                        console.log(err);
                      }
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
            {isChanging || isLoading ? (
              <Spinner />
            ) : (
              <>
                <IconButton
                  height={"40px"}
                  width={"40px"}
                  icon={<FiDownload />}
                  aria-label={""}
                />
              </>
            )}
          </Flex>
        </Card>
      )}
    </div>
  );
};
export default FieldAnswer;
