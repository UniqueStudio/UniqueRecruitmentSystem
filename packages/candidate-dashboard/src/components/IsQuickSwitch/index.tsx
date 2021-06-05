import { FormControlLabel, IconButton, makeStyles, Switch } from '@material-ui/core';
import { HelpOutline } from '@material-ui/icons';
import { Controller } from 'react-hook-form';

import { usePopover } from 'hooks/usePopover';

const useStyle = makeStyles((theme) => ({
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(1),
  },
}));

export const IsQuickSwitch: React.FC = () => {
  // Popover
  const classes = useStyle();
  const { handlePopoverClose, handlePopoverOpen, Pop } = usePopover({
    content: '所谓的快速通道 xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    id: 'isquick-popover',
    className: classes.popover,
    classes: { paper: classes.paper },
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'center',
    },
    transformOrigin: {
      vertical: 'top',
      horizontal: 'center',
    },
  });

  return (
    <FormControlLabel
      className={classes.center}
      control={
        <Controller
          name='isQuick'
          render={({ field: { ref, ...props } }) => <Switch inputRef={ref} {...props} size='small' />}
        />
      }
      label={
        <div className={classes.center}>
          <span>快速通道</span>
          <IconButton size='small' onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}>
            <HelpOutline fontSize='small' />
          </IconButton>
          {Pop}
        </div>
      }
      labelPlacement='start'
    />
  );
};
