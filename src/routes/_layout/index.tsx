import {
  Box,
  Container,
  Flex,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { LineChart, Line, PieChart, Pie, Tooltip, Cell } from "recharts"; // Import the necessary components

import useAuth from "../../hooks/useAuth";
import { UsersService } from "../../client";
import React, { useEffect } from "react";
import { set } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
});

const fetchTaskCount = async () => {
  const data = await UsersService.readTaskData();
  return data;
};

const fetchLeaveDays = async () => {
  const data = await UsersService.readLeaveData();
  return data;
};

function Dashboard() {
  const { user: currentUser } = useAuth();
  const [taskData, setTaskData] = React.useState<any>(undefined);
  const [leaveData, setLeaveData] = React.useState<any>(undefined);

  const fetchData = async () => {
    const task_data = await UsersService.readTaskData();

    const leave_data = await UsersService.readLeaveData();

    setTaskData(task_data);
    setLeaveData(leave_data);
    console.log(leave_data);

    return [task_data, leave_data];
  };

  const query = useQuery({
    queryKey: ["leave_data"],
    queryFn: fetchData,
  });

  const TASK_COLORS = ["#FFBB28", "#00C49F", "#0088FE", "#FF8042"];

  const data01 = [
    {
      name: "Group A",
      value: 400,
    },
    {
      name: "Group B",
      value: 300,
    },
    {
      name: "Group C",
      value: 300,
    },
    {
      name: "Group D",
      value: 200,
    },
    {
      name: "Group E",
      value: 278,
    },
    {
      name: "Group F",
      value: 189,
    },
  ];
  const data02 = [
    {
      name: "Group A",
      value: 2400,
    },
    {
      name: "Group B",
      value: 4567,
    },
    {
      name: "Group C",
      value: 1398,
    },
    {
      name: "Group D",
      value: 9800,
    },
    {
      name: "Group E",
      value: 3908,
    },
    {
      name: "Group F",
      value: 4800,
    },
  ];
  return (
    <>
      <Container maxW="full">
        <Box pt={12} m={4}>
          <Text fontSize="2xl">
            Hi, {currentUser?.full_name || currentUser?.email} 👋🏼
          </Text>
          <Text>Welcome back, nice to see you again!</Text>
          <SimpleGrid marginTop={"10px"} columns={2} spacing={10}>
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              flexDirection={"column"}
              bg="#50505020"
              borderRadius={"10px"}
              height="300px"
            >
              <div
                style={{
                  width: "90%",
                  marginTop: "10px",
                  marginLeft: "20px",
                  display: "flex",
                  justifyContent: "left",
                }}
              >
                Task Analytics:
              </div>
              {taskData ? (
                <PieChart width={350} height={250}>
                  <Pie
                    data={taskData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#82ca9d"
                    label
                  >
                    {taskData.map((entry: any, index: number) => {
                      console.log(entry);

                      return (
                        <Cell
                          key={`cell-${index}`}
                          fill={TASK_COLORS[index % TASK_COLORS.length]}
                        />
                      );
                    })}
                  </Pie>
                  <Tooltip />
                </PieChart>
              ) : (
                <Spinner />
              )}
            </Box>
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              flexDirection={"column"}
              bg="#50505020"
              borderRadius={"10px"}
              height="300px"
            >
              <div
                style={{
                  width: "90%",
                  marginTop: "10px",
                  marginLeft: "20px",
                  display: "flex",
                  justifyContent: "left",
                }}
              >
                Leave Analytics:
              </div>

              {leaveData ? (
                <PieChart width={350} height={250}>
                  <Pie
                    data={leaveData}
                    dataKey="total_days"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#82ca9d"
                    label
                  >
                    {leaveData.map((entry: any, index: number) => {
                      console.log(entry);

                      return (
                        <Cell
                          key={`cell-${index}`}
                          fill={TASK_COLORS[index % TASK_COLORS.length]}
                        />
                      );
                    })}
                  </Pie>
                  <Tooltip />
                </PieChart>
              ) : (
                <Spinner />
              )}
            </Box>
          </SimpleGrid>
        </Box>
      </Container>
    </>
  );
}
