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

const guidGenerator = () => {
  var S4 = function() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

const savedAccounts = window.localStorage.getItem('accounts');

const App = () => {
  const [accounts, setAccounts] = useState(savedAccounts ? JSON.parse(savedAccounts) : []);
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    refreshBalances()
  }, [refresh]);

  useEffect(() => {
    window.localStorage.setItem('accounts', JSON.stringify(accounts));
  }, [accounts]);

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
          <Typography variant="h5" component="h1" gutterBottom>
            Total balance:
          </Typography>
          <Typography variant="h4" component="p">
            {getTotalBalance().toLocaleString()}
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

export default App;
