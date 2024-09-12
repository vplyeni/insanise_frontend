import { Box, Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { FiBriefcase, FiHome, FiSettings, FiUsers } from "react-icons/fi";

import type { UserPublic } from "../../client";

const items = [
  { icon: FiHome, title: "Dashboard", path: "/" },
  { icon: FiBriefcase, title: "My Tasks", path: "/my_tasks" },
  { icon: FiBriefcase, title: "My Leaves", path: "/my_leaves" },
];

interface SidebarItemsProps {
  onClose?: () => void;
}

const SidebarItems = ({ onClose }: SidebarItemsProps) => {
  const queryClient = useQueryClient();
  const textColor = useColorModeValue("ui.main", "ui.light");
  const bgActive = useColorModeValue("#E2E8F0", "#4A5568");
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"]);

  console.log(currentUser);

  const items1 = currentUser?.is_manager
    ? [
        ...items,
        { icon: FiUsers, title: "Group Management", path: "/target_groups" },
        { icon: FiUsers, title: "User Management", path: "/employees" },
        { icon: FiUsers, title: "Team Management", path: "/teams" },
        { icon: FiBriefcase, title: "Task Management", path: "/tasks" },
        { icon: FiBriefcase, title: "Task Results", path: "/task_results" },
      ]
    : items;
  /*
  finalItems = currentUser?.is_superuser 
    ? [...finalItems, { icon: FiUsers, title: "Admin", path: "/admin" }]
    : finalItems
  */
  const finalItems = currentUser?.is_lead
    ? [
        ...items1,
        { icon: FiUsers, title: "Leaves Management", path: "/leaves" },
        { icon: FiSettings, title: "User Settings", path: "/settings" },
      ]
    : [
        ...items1,
        { icon: FiSettings, title: "User Settings", path: "/settings" },
      ];

  const listItems = finalItems.map(({ icon, title, path }) => (
    <Flex
      as={Link}
      to={path}
      w="100%"
      p={2}
      key={title}
      activeProps={{
        style: {
          background: bgActive,
          borderRadius: "12px",
        },
      }}
      color={textColor}
      onClick={onClose}
    >
      <Icon as={icon} alignSelf="center" />
      <Text ml={2}>{title}</Text>
    </Flex>
  ));

  return (
    <>
      <Box>{listItems}</Box>
    </>
  );
};

export default SidebarItems;
