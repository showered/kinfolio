import React, { useEffect, useState, useMemo } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import AccountDialog from './AccountDialog';

const AccountItem = ({ account, handleDelete, handleModify }) => {
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] = useState(false);
  const {
    balance = 'Loading...',
    label,
  } = account;

  const handleEditClick = () => setAccountDialogOpen(true);
  const handleDeleteClick = () => setDeleteConfirmationDialogOpen(true);

  const handleAddAccount = (props) => {
    handleModify(props);
    setAccountDialogOpen(false);
  };

  const handleDeleteAccount = () => {
    handleDelete(account);
    setDeleteConfirmationDialogOpen(false);
  }

  const handleCloseAddAccount = () => setAccountDialogOpen(false);
  const handleCloseDeleteConfirmation = () => setDeleteConfirmationDialogOpen(false);

  return (
    <React.Fragment>
      <ListItem onClick={handleEditClick}>
        <ListItemAvatar>
          <Avatar style={{ backgroundColor: 'rgb(111, 65, 232)', color: 'white' }}>
            {label.substr(0, 1).toUpperCase()}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={label}
          secondary={
            <React.Fragment>
              {balance ? Math.floor(balance).toLocaleString() : null}
            </React.Fragment>
          }
        />
        <ListItemSecondaryAction>
          <IconButton
            edge="end"
            aria-label="edit"
            onClick={handleEditClick}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={handleDeleteClick}
          >
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>

      <AccountDialog
        account={account}
        action="Edit"
        handleAddAccount={handleAddAccount}
        handleCloseAddAccount={handleCloseAddAccount}
        open={accountDialogOpen}
        title="Edit account"
      />

      <Dialog
        open={deleteConfirmationDialogOpen}
        onClose={handleCloseDeleteConfirmation}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Delete account'}</DialogTitle>
        <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to remove this account?
        </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button onClick={handleCloseDeleteConfirmation}>
          Cancel
        </Button>
        <Button onClick={handleDeleteAccount} color="secondary" autoFocus>
          Delete
        </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default AccountItem;
