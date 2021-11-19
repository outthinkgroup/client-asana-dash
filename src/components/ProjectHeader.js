import React from "react";
import { Box, Heading, Badge } from "@chakra-ui/react";

function ProjectHeader({ project }) {
  return (
    <>
      <Box bg="blue.50" as="header">
        <Box className="" maxW={960} p={6} mx="auto">
          <Heading as="h1" size="md" color="blue.700">
            Outthink Asana Client Dashboard
          </Heading>
          <Heading as="h2" fontWeight="300">
            {project?.name}
          </Heading>
        </Box>
      </Box>
      <Box
        className=""
        maxW={960}
        alignItems="center"
        p={6}
        mx="auto"
        justifyContent="space-between"
      >
        {project?.current_status && (
          <>
            <Badge className="heading-label">Status</Badge>
            <h2>{project.current_status?.title}</h2>
          </>
        )}
      </Box>
    </>
  );
}

export default ProjectHeader;
