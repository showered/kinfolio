import React, { useEffect, useState, useMemo } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

const AccountDialog = ({
  account = {},
  action = 'Ok',
  handleCloseAddAccount,
  handleAddAccount,
  open,
  title,
}) => {
  const [addAccountLabel, setAddAccountLabel] = useState(account?.label);
  const [addAccountPublicAddress, setAddAccountPublicAddress] = useState(account?.publicAddress);

  return (
    <Dialog open={open} onClose={handleCloseAddAccount} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          defaultValue={addAccountPublicAddress}
          margin="dense"
          id="add-account-public-address"
          label="Public address"
          type="text"
          onChange={e => setAddAccountPublicAddress(e.target.value)}
          fullWidth
          required
        />
        <TextField
          defaultValue={addAccountLabel}
          margin="dense"
          id="add-account-label"
          label="Label"
          type="text"
          onChange={e => setAddAccountLabel(e.target.value)}
          fullWidth
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseAddAccount} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => {
            handleAddAccount({
              ...account,
              label: addAccountLabel,
              publicAddress: addAccountPublicAddress,
            });
          }}
          color="primary"
        >
          {action}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AccountDialog;
