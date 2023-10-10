import React, { Fragment, useEffect, useState } from 'react';
import { Button, Container, HStack, Heading, Image, Radio, RadioGroup, Text, VStack } from '@chakra-ui/react';
import axios from 'axios';

// importing variables
import {server} from '../index';

// importing components
import Loader from './Loader';
import ErrorComponent from './ErrorComponent';
import { Link } from 'react-router-dom';

const Coins = () => {

  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [currency, setCurrency] = useState('inr');

  const currencySymbol = (currency === 'inr' ? "₹" : currency === 'eur' ? "€" : "$");

  // function to change pages
  const changePage =(page)=> {
    setPage(page);
    setLoading(true);
  }

  const btns = new Array(132).fill(1);

  useEffect(() => {
    
    const fetchCoins = async () => {
      
      try {
        const { data } = await axios.get(`${server}/coins/markets?vs_currency=${currency}&page=${page}`); 
        // console.log(data);

        setCoins(data);
        setLoading(false);
      } 
      catch(err) {
        setError(true);
        setLoading(false);
      }

    };

    fetchCoins();

  }, [currency, page]);


  if(error) return <ErrorComponent message={"Error While Fetching Coins"} />;
  

  return (
    <Container maxW={'container.xl'}>

      {
        loading ? (
          <Loader />
        ) : (
          <Fragment>


            <RadioGroup 
              value={currency} 
              onChange={setCurrency} 
              p={'8'}
            >
              <HStack spacing={'4'}>
                <Radio value={'inr'}>INR</Radio>
                <Radio value={'usd'}>USD</Radio>
                <Radio value={'eur'}>EUR</Radio>
              </HStack>
            </RadioGroup>


            <HStack wrap={'wrap'} justifyContent={'center'} alignItems={'center'}>

              {
                coins.map((item)=> (
                  <CoinCard 
                    id={item.id}
                    key={item.id}
                    name={item.name} 
                    img={item.image}
                    symbol={item.symbol}
                    price={item.current_price}
                    currencySymbol={currencySymbol}
                  />
                ))  
              }
              
            </HStack>

            {/* Pagination */}
            <HStack
              w={'full'}
              overflowX={'auto'}
              p={'8'}
            >
              {
                btns.map((Item, Index)=> (
                  <Button 
                    key={Index}
                    onClick={()=>changePage(Index+1)}
                    bgColor={'blackAlpha.900'}
                    color={'white'}
                  >
                    {Index+1}
                  </Button>
                ))
              }
            </HStack>
          </Fragment>
        )
      }

    </Container>
  );
};




const CoinCard = ({id, name, img, symbol, price, currencySymbol="₹"}) => (
  <Link to={`/coins/${id}`}>
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

       <Heading size={'md'} noOfLines={1} textTransform={'uppercase'}> { symbol } </Heading>

       <Text noOfLines={1}> { name } </Text>
       <Text noOfLines={1}> { price ? `${currencySymbol}${price}` : "NA"  } </Text>

    </VStack>
  </Link>
);

export default Coins;