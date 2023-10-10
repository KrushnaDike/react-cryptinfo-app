import { Badge, Box, Button, Container, HStack, Image, Progress, Radio, RadioGroup, Stat, StatArrow, StatHelpText, StatLabel, StatNumber, Text, VStack } from '@chakra-ui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// importing variables
import {server} from '../index';

// importing components
import Loader from './Loader';
import ErrorComponent from './ErrorComponent';
import Chart from './Chart';

const CoinDetails = () => {
  
  const params = useParams();
  const [coin, setCoin] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currency, setCurrency] = useState('inr');
  const [days, setDays] = useState("24h");
  const [chartArray, setChartArray] = useState([]);

  const currencySymbol = (currency === 'inr' ? "₹" : currency === 'eur' ? "€" : "$");
 
  // to update chart the basis of given time
  const btns = ["24h", "7d", "14d", "30d", "60d", "1y", "max"];
  const switchChartStats = (key) => {
    
    switch (key) {
      case "24h":
        setDays("24h");
        setLoading(true);
        break;

      case "7d":
        setDays("7d");
        setLoading(true);
        break;

      case "14d":
        setDays("14d");
        setLoading(true);
        break;

      case "30d":
        setDays("30d");
        setLoading(true);
        break;

      case "60d":
        setDays("60d");
        setLoading(true);
        break;

      case "1y":
        setDays("365d");
        setLoading(true);
        break;

      case "max":
        setDays("max");
        setLoading(true);
        break;

      default:
        setDays("24h");
        setLoading(true);
        break;
    }
  }

  useEffect(() => {
    
    const fetchCoin = async () => {
      
      try {
        const { data } = await axios.get(`${server}/coins/${params.id}`); 

        const { data:chartData } = await axios.get(`${server}/coins/${params.id}/market_chart?vs_currency=${currency}&days=${days}`);

        setChartArray(chartData.prices);
        setCoin(data);
        setLoading(false);
      } 
      catch(err) {
        setError(true);
        setLoading(false);
      }

    };

    fetchCoin();

  }, [params.id, currency, days]);

  if(error) return <ErrorComponent message={"Error While Fetching Coin"} />;

  return (
    <Container maxW={'container.xl'}>
      {
        loading ? (
          <Loader />
        ) : (
          <Fragment>

            <Box w={'full'} borderWidth={1}>
              <Chart arr={chartArray} currency={currencySymbol} days={days} />
            </Box>

            {/* Button -> to update line chart */}
            <HStack p={'4'} overflowX={'auto'}>
              {
                btns.map((item)=>(
                  <Button 
                    key={item}
                    onClick={()=>switchChartStats(item)}
                  >
                    {item}
                  </Button>
                ))
              }
            </HStack>

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

            {/* main work */}
            <VStack 
              alignItems={'flex-start'} 
              spacing={'4'} 
              p={'8'}
            >
              <Text 
                opacity={0.7} 
                fontSize={'small'} 
                alignSelf={'center'}
              >
                Last Updated On {" "}
                {Date(coin.market_data.last_updated).split("G")[0]}
              </Text>

              <Image 
                src={coin.image.large} 
                w={'16'}
                h={'16'}
                objectFit={'contain'}
              />

              {/* stat is just like a wraper tag */}
              <Stat>
                <StatLabel> {coin.name} </StatLabel>
                <StatNumber> {currencySymbol}{coin.market_data.current_price[currency]} </StatNumber>
                <StatHelpText>
                  <StatArrow 
                    type={
                      coin.market_data.price_change_percentage_24h > 0 
                      ? 'increase' 
                      : 'decrease'
                      }   
                  />
                  
                  {coin.market_data.price_change_percentage_24h}%
                </StatHelpText>
              </Stat>

              {/* badge is similar to wraper tag */}
              <Badge
                fontSize={'2xl'}
                bgColor={'blackAlpha.800'}
                color={'white'}
              >
                #{coin.market_cap_rank}
              </Badge>

              <CustomBar 
                high={`${currencySymbol}${coin.market_data.high_24h[currency]}`} 
                low={`${currencySymbol}${coin.market_data.low_24h[currency]}`}
              />

              <Box p={'4'} w={'full'}>
                <Item title={"Max Supply"} value={coin.market_data.max_supply} />
                <Item title={"Circulating Supply"} value={coin.market_data.circulating_supply} />
                <Item title={"Market Cap"} value={`${currencySymbol}${coin.market_data.market_cap[currency]}`} />
                <Item title={"All Time Low"} value={`${currencySymbol}${coin.market_data.atl[currency]}`} />
                <Item title={"All Time High"} value={`${currencySymbol}${coin.market_data.ath[currency]}`} />
              </Box>
            </VStack>

          </Fragment>
        )

      }
    </Container>
  );
};


const CustomBar = ({high, low}) => (
  <VStack w={'full'}>
    <Progress 
      value={'50'}
      w={'full'}
      colorScheme='teal'
    /> 

    <HStack w={'full'} justifyContent={'space-between'}>
      <Badge children={low} colorScheme={'red'} />
      <Text fontSize={'sm'}>24H Range</Text>
      <Badge children={high} colorScheme={'green'} />
    </HStack>
  </VStack>
);

const Item = ({title, value}) => (
  <HStack justifyContent={'space-between'} w={'full'} my={'4'}>
    <Text fontFamily={'Bebas Neue'} letterSpacing={'widest'}> {title} </Text>
    <Text> {value} </Text>
  </HStack>
);


export default CoinDetails;