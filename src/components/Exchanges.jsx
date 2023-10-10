import React, { Fragment, useEffect, useState } from 'react';
import { Container, HStack, Heading, Image, Text, VStack } from '@chakra-ui/react';
import axios from 'axios';

// importing variables
import {server} from '../index';

// importing components
import Loader from './Loader';
import ErrorComponent from './ErrorComponent';

const Exchanges = () => {

  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    
    const fetchExhanges = async () => {

      try {
        const { data } = await axios.get(`${server}/exchanges`); 
        // console.log(data);

        setExchanges(data);
        setLoading(false);
      } 
      catch(err) {
        setError(true);
        setLoading(false);
      }

    };

    fetchExhanges();

  }, []);


  if(error) return <ErrorComponent message={"Error While Fetching Exchanges"} />;
  

  return (
    <Container maxW={'container.xl'}>

      {
        loading ? (
          <Loader />
        ) : (
          <Fragment>
            <HStack wrap={'wrap'} justifyContent={'center'} alignItems={'center'}>

              {
                exchanges.map((item)=> (
                  <ExchangeCard 
                    key={item.id}
                    name={item.name} 
                    img={item.image}
                    rank={item.trust_score_rank}
                    url={item.url}  
                  />
                ))  
              }
              
            </HStack>
          </Fragment>
        )
      }

    </Container>
  );
};


const ExchangeCard = ({name, img, rank, url}) => (
  <a href={url} target='blank'>
    <VStack
      w={'52'}
      shadow={'lg'}
      p={'8'}
      borderRadius={'lg'}
      m={'4'}
      transition={'all 0.3s'}
      css={{
        "&:hover": {
          transform: "scale(1.1)",
        },
      }}
      gap={'4'}
    >

      <Image
        src={img}
        w={'10'}
        h={'10'}
        objectFit={'contain'}
        alt={'Exchange'}
       />

       <Heading size={'md'} noOfLines={1}> { rank } </Heading>

       <Text noOfLines={1}> { name } </Text>

    </VStack>
  </a>
);

export default Exchanges;