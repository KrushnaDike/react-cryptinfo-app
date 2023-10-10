import { Button, HStack } from '@chakra-ui/react';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <Fragment>

      <HStack p={'4'} shadow={'base'} bgColor={'blackAlpha.900'}>

        <Button variant={'unstyled'} color={'white'}>
          <Link to={'/'}>Home</Link>
        </Button>

        <Button variant={'unstyled'} color={'white'}>
          <Link to={'/exchanges'}>Exchanges</Link>
        </Button>

        <Button variant={'unstyled'} color={'white'}>
          <Link to={'/coins'}>Coins</Link>
        </Button>

      </HStack>

    </Fragment>
  );
};

export default Header;

