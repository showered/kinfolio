import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { Environment, KinClient } from '@kinecosystem/kin-sdk-node';

import AccountItem from './AccountItem';
import AccountDialog from './AccountDialog';

const client = new KinClient(Environment.Production);

const KIN_RATE_API = (currency) => `https://www.coinbase.com/api/v2/assets/prices/238e025c-6b39-57ca-91d2-4ee7912cb518?base=${currency}`;

const guidGenerator = () => {
  var S4 = function() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

const getCurrencySymbol = (currency) => {
  switch(currency) {
    case 'USD':
      return '$';
    case 'GBP':
      return '£';
    case 'EUR':
      return '€';
    default:
      return currency;
  }
}

const savedExchangeRate = window.localStorage.getItem('exchangeRate');
const savedLocalCurrency = window.localStorage.getItem('localCurrency');
const savedAccounts = window.localStorage.getItem('accounts');

const App = () => {
  const [accounts, setAccounts] = useState(savedAccounts ? JSON.parse(savedAccounts) : []);
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(savedExchangeRate);
  const [localCurrency, setLocalCurrency] = useState(savedLocalCurrency || 'USD');
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    getExchangeRate();
  }, [localCurrency]);

  useEffect(() => {
    refreshBalances();
  }, [refresh]);

  useEffect(() => {
    window.localStorage.setItem('accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    window.localStorage.setItem('exchangeRate', exchangeRate);
  }, [exchangeRate]);

  useEffect(() => {
    window.localStorage.setItem('localCurrency', localCurrency);
  }, [localCurrency]);

  const refreshBalances = async () => {
    const newAccounts = [...accounts];
    for (const account of newAccounts) {
      try {
        account.balance = await client.getAccountBalance(account.publicAddress);
      } catch (e) {
       
      }
    }
    setAccounts(newAccounts);
  };

  const getExchangeRate = async () => {
    const rate = await fetch(KIN_RATE_API(localCurrency));
    const rateJson = await rate.json()
    setExchangeRate(rateJson?.data?.prices?.latest);
  }

  const handleModifyAccount = (modifiedAccount) => {
    setAccounts(accounts.map((o) => {
      if (o.id === modifiedAccount.id) return {...modifiedAccount}
      return o;
    }));
    setTimeout(() => setRefresh(Math.random()), 0);
  }

  const handleDeleteAccount = (deletedAccount) => {
    setAccounts(accounts.filter(account => account.id !== deletedAccount.id));
    setTimeout(() => setRefresh(Math.random()), 0);
  }

  const getTotalBalance = useCallback(() => {
    let initialValue = 0;
    return accounts.reduce((accumulator, { balance = 0 }) => (
      accumulator + balance
    ), initialValue);
  }, [accounts]);

  const showAccounts = useMemo(() => (
    <List>
      {accounts.map((account, index) => {
        return (
          <React.Fragment key={`account-list-item-${account.id}`}>
            <AccountItem
              account={account}
              handleDelete={handleDeleteAccount}
              handleModify={handleModifyAccount}
            />
            <Divider variant="inset" component="li" />
          </React.Fragment>
        );
      })}
      <ListItem onClick={() => setAccountDialogOpen(true)} style={{ cursor: 'pointer' }}>
        <ListItemAvatar>
          <Avatar>
            +
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={'Add account'}
        />
      </ListItem>
    </List>
  ), [accounts]);

  const handleCloseAddAccount = () => setAccountDialogOpen(false);

  const handleAddAccount = ({
    label,
    publicAddress,
  }) => {
    if (label && publicAddress) {
      setAccounts(prevAccounts => [
        ...prevAccounts,
        {
          currency: 'KIN',
          id: guidGenerator(),
          label,
          publicAddress,
        },
      ]);
      setAccountDialogOpen(false);
      setRefresh(Math.random());
    }
  };

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <div style={headingStyles}>
          <Typography variant="p" component="p" gutterBottom>
            Total balance:
          </Typography>
          <Typography variant="h5" component="p" style={totalBalanceStyles}>
            <img style={kinIconStyles} src={require('./assets/Kin_logo_RGB-purplecoin.png')} />
            {Math.floor(getTotalBalance()).toLocaleString()}
          </Typography>
          <Typography variant="h6" component="p" onClick={() => setLocalCurrency(localCurrency === 'USD' ? 'GBP' : 'USD')}>
            {getCurrencySymbol(localCurrency)}
            {parseFloat(getTotalBalance() * (exchangeRate || 0)).toFixed(2).toLocaleString()}
          </Typography>
        </div>
        { showAccounts }

        { accountDialogOpen && (
          <AccountDialog
            action="Add"
            handleAddAccount={handleAddAccount}
            handleCloseAddAccount={handleCloseAddAccount}
            open={accountDialogOpen}
            title="Add account"
          />
        )}
      </Box>
    </Container>
  );
};

const headingStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const kinIconStyles = {
  height: 32,
  width: 32,
  marginRight: 6,
}

const totalBalanceStyles = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
}

export default App;
