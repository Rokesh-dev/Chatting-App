import {
  Container,
  Box,
  Image,
  Flex,
  Text
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Login } from "../components";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!userInfo) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <Container maxWidth="xl">
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Flex>
          <Image
            objectFit='cover'
            boxSize="50px"
            src={"/logo512.png"}
            alt={"Chatting-App"}
          />
          <Text flex='1' fontSize="4xl" fontFamily="Work sans" textAlign="center">
            Chatting-App
          </Text>
        </Flex>
      </Box>

      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Text fontSize="xl" fontFamily="Work sans" textAlign="center">
          Login
        </Text>
        <Login />
      </Box>
    </Container>
  );
};

export default Home;
