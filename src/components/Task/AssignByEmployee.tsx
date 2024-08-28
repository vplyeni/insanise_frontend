import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ApiError,
  TasksService,
  TDataSearchUserPagination,
  UserPublic,
  UsersService,
} from "../../client";
import useCustomToast from "../../hooks/useCustomToast";
import { useEffect, useState } from "react";
import { Box, Button, Divider, Input, Spinner } from "@chakra-ui/react";
import { handleError } from "../../utils";

interface AssignByEmployeeProps {
  selectedUsers: UserPublic[];
  setSelectedUsers: any;
}

const AssignByEmployee = ({
  selectedUsers,
  setSelectedUsers,
}: AssignByEmployeeProps) => {
  const showToast = useCustomToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(5);
  const [inputValue, setInputValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState(inputValue);
  const [results, setResults] = useState([] as UserPublic[]);

  const [first, setFirst] = useState(true);

  useEffect(() => {
    const handler = setTimeout(() => {
      console.log(1);
      setDebouncedValue(inputValue);
    }, 500); // Delay in milliseconds

    // Clean up the timeout if the user is still typing
    return () => {
      console.log(2);
      clearTimeout(handler);
    };
  }, [inputValue]);

  useEffect(() => {
    console.log(3);
    if (!first) {
      console.log(4);
      setIsChanging(false);
      setIsLoading(true);
      mutation.mutate({
        skip: skip,
        limit: limit,
        request_body: {
          search: debouncedValue,
          selected_employees: selectedUsers.map((item: UserPublic) => item.id),
        },
      });
      console.log("User finished typing:", debouncedValue);
    } else {
      console.log(5);

      setFirst(false);
    }
  }, [debouncedValue]);

  const handleSelect = (user: UserPublic) => {
    console.log(user);
    console.log(selectedUsers);
    console.log(selectedUsers.map((i) => i.id).includes(user.id));
    if (selectedUsers.map((i) => i.id).includes(user.id)) {
      console.log(1);

      if (!results.map((i) => i.id).includes(user.id)) {
        if (
          user.full_name.toLowerCase().includes(debouncedValue.toLowerCase()) ||
          debouncedValue == ""
        ) {
          console.log("Listede, aramaya uygun");

          setResults([...results, user]);
          setSelectedUsers((prev: UserPublic[]) =>
            prev.filter((j: UserPublic) => j.id !== user.id)
          );
        } else {
          console.log("Listede, aramaya uygun değil");
          setSelectedUsers((prev: UserPublic[]) =>
            prev.filter((j: UserPublic) => j.id !== user.id)
          );
        }
      } else {
        setSelectedUsers((prev: UserPublic[]) =>
          prev.filter((j: UserPublic) => j.id !== user.id)
        );
      }
    } else {
      console.log("Listede değil");

      setSelectedUsers((prev: UserPublic[]) => [...prev, user]);
    }
  };

  const mutation = useMutation({
    mutationFn: (data: TDataSearchUserPagination) =>
      UsersService.searchUser(data),
    onSuccess: (e: any) => {
      setIsLoading(false);
      setResults(e.data);
    },
    onError: (err: ApiError) => {
      setIsLoading(false);
      setResults([]);
      handleError(err, showToast);
    },
  });

  return (
    <>
      <Input
        placeholder="Search Employee.."
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setIsChanging(true);
        }}
        mb={4}
      />
      <Divider></Divider>
      <div style={{ width: "100%", whiteSpace: "nowrap", overflowY: "auto" }}>
        {selectedUsers.map((item, index) => (
          <Button
            key={index}
            style={{ display: "inline-block" }}
            minW={"100px"}
            margin={"5px"}
            onClick={() => {
              handleSelect(item);
            }}
          >
            {item.full_name}
          </Button>
        ))}
      </div>
      {selectedUsers.length > 0 && <Divider></Divider>}
      {!(isChanging || isLoading) ? (
        <Box marginTop={"10px"} overflowY="auto" maxH="300px">
          {results
            .sort((i) => i.id)
            .filter(
              (item: UserPublic) =>
                !selectedUsers.map((i) => i.id).includes(item.id)
            )
            .map((result: UserPublic, index) => (
              <Box
                borderBottom="2px solid"
                marginBottom={"5px"}
                borderColor="#ffffff10"
                borderRadius={"10px"}
                paddingLeft={"15px"}
                minH={"50px"}
                key={index}
                transition="background-color 0.3s ease"
                _hover={{ bg: "#70707030" }}
              >
                <div
                  onClick={() => {
                    handleSelect(result);
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
                  {result.full_name}
                </div>
              </Box>
            ))}
        </Box>
      ) : (
        <Box>
          <Spinner></Spinner>
        </Box>
      )}
    </>
  );
};
export default AssignByEmployee;
